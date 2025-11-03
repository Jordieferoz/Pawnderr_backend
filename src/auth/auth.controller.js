// src/auth/auth.controller.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { varOcg } from '../db.js';
import crypto from 'crypto';
import { generateOtp, saveOtp, sendOtpSms, sendOtpEmail, hashOtp, sendResetLink } from './otp.service.js';

const router = express.Router();

// register -> create user, generate OTP, send via phone/email
router.post('/register', async (req, res) => {
  const { email, password, phone, name, gender, latitude, longitude } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email & password required' });
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const { rows } = await varOcg.query(
      `INSERT INTO users(email, password_hash, phone, name, gender, latitude, longitude) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id,email`,
      [email, passwordHash, phone, name, gender, latitude, longitude]
    );
    const userId = rows[0].id;

    const otp = generateOtp(6);
    await saveOtp(userId, otp);
    if (phone) await sendOtpSms(phone, otp);
    else 
    await sendOtpEmail(email, otp);
    res.status(201).json({ message: 'Registered. OTP sent.', userId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration error' });
  }
});

// verify OTP
router.post('/verify-otp', async (req, res) => {
  const { userId, otp } = req.body;
  if (!userId || !otp) return res.status(400).json({ error: 'userId & otp required' });
  try {
    const hashed = hashOtp(otp);
    const { rows } = await varOcg.query(
      `SELECT * FROM user_otps WHERE user_id=$1 AND otp_code=$2 AND verified=false AND expires_at>NOW()`,
      [userId, hashed]
    );
    if (!rows.length) return res.status(400).json({ error: 'Invalid/expired OTP' });
    await varOcg.query(`UPDATE user_otps SET verified=true WHERE id=$1`, [rows[0].id]);
    await varOcg.query(`UPDATE users SET email_verified=true WHERE id=$1`, [userId]);
    res.json({ message: 'OTP verified' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OTP verification error' });
  }
});

// login -> returns JWT
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await varOcg.query(`SELECT * FROM users WHERE email=$1`, [email]);
    if (!rows.length) return res.status(400).json({ error: 'Invalid credentials' });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login error' });
  }
});


router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    // Check if user exists
    const userRes = await varOcg.query("SELECT * FROM users WHERE email=$1", [email]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await varOcg.query(
      "UPDATE users SET reset_token=$1, reset_token_expiry=$2 WHERE email=$3",
      [token, expiry, email]
    );
    await sendResetLink(token, email);
    res.status(200).json({ message: 'Password reset link sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error processing request" });
  }
});


router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword)
    return res.status(400).json({ error: "Token and new password required" });

  try {
    const userRes = await varOcg.query(
      "SELECT * FROM users WHERE reset_token=$1 AND reset_token_expiry > NOW()",
      [token]
    );

    if (userRes.rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await varOcg.query(
      "UPDATE users SET password=$1, reset_token=NULL, reset_token_expiry=NULL WHERE reset_token=$2",
      [hashedPassword, token]
    );

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default router;
