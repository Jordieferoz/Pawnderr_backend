import twilio from 'twilio';
import { varOcg } from '../db.js';
import { hashOtp, generateOtp, compareOtp } from '../utils/otp.util.js';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send OTP via SMS using Twilio
 */
export const sendOtpViaSms = async (phoneNumber, userId) => {
  const otp = generateOtp();
  const hashedOtp = hashOtp(otp);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  try {
    // Store OTP in database
    await varOcg.query(
      `INSERT INTO user_otps(user_id, otp_code, method, verified, expires_at) 
       VALUES($1, $2, 'sms', false, $3)`,
      [userId, hashedOtp, expiresAt]
    );

    // Send SMS via Twilio
    await client.messages.create({
      body: `Your Pawnderr verification code is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP');
  }
};

/**
 * Send OTP via Email (placeholder for email service)
 */
export const sendOtpViaEmail = async (email, userId) => {
  const otp = generateOtp();
  const hashedOtp = hashOtp(otp);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  try {
    // Store OTP in database
    await varOcg.query(
      `INSERT INTO user_otps(user_id, otp_code, method, verified, expires_at) 
       VALUES($1, $2, 'email', false, $3)`,
      [userId, hashedOtp, expiresAt]
    );

    // TODO: Implement email sending logic (e.g., using SendGrid, AWS SES, etc.)
    console.log(`OTP for ${email}: ${otp}`); // For development

    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP');
  }
};

/**
 * Verify OTP
 */
export const verifyOtp = async (userId, otp) => {
  try {
    // Get all unverified, non-expired OTPs for this user
    const { rows } = await varOcg.query(
      `SELECT * FROM user_otps 
       WHERE user_id=$1 AND verified=false AND expires_at>NOW()
       ORDER BY created_at DESC`,
      [userId]
    );

    if (!rows.length) {
      return { success: false, message: 'Invalid or expired OTP' };
    }

    // Try to match the provided OTP with any of the stored hashed OTPs
    let matchFound = false;
    for (const row of rows) {
      const isMatch = await compareOtp(otp, row.otp_code);
      if (isMatch) {
        matchFound = true;
        // Mark OTP as verified
        await varOcg.query(`UPDATE user_otps SET verified=true WHERE id=$1`, [row.id]);
        break;
      }
    }

    if (!matchFound) {
      return { success: false, message: 'Invalid OTP' };
    }

    // Mark user email as verified
    await varOcg.query(`UPDATE users SET email_verified=true WHERE id=$1`, [userId]);

    return { success: true, message: 'OTP verified successfully' };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw new Error('Failed to verify OTP');
  }
};

