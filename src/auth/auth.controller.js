// src/auth/auth.controller.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { varOcg } from '../db.js';

const router = express.Router();

// register -> create user, generate OTP, send via phone/email
router.post('/register', async (req, res) => {
  const { email, password, phone, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email & password required' });
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const { rows } = await varOcg.query(
      `INSERT INTO users(email, password_hash, phone, name) VALUES($1,$2,$3,$4) RETURNING id,email`,
      [email, passwordHash, phone, name]
    );
    const userId = rows[0].id;

    res.status(201).json({ message: 'Registered.', userId });
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

export default router;
