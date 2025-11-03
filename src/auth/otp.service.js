// src/auth/otp.service.js
import crypto from 'crypto';
import { varOcg } from '../db.js';
import twilio from 'twilio';
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({ region: process.env.AWS_REGION });

const twilioClient = process.env.TWILIO_SID ? twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN) : null;

// generate numeric OTP
export function generateOtp(len = 6) {
  let otp = '';
  for (let i = 0; i < len; i++) otp += Math.floor(Math.random() * 10);
  return otp;
}

export function hashOtp(otp) {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

export async function saveOtp(userId, otp) {
  const hashed = hashOtp(otp);
  const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 min
  await varOcg.query(
    `INSERT INTO user_otps(user_id, otp_code, expires_at) VALUES($1,$2,$3)`,
    [userId, hashed, expires]
  );
}

export async function sendOtpSms(phone, otp) {
  if (!twilioClient) throw new Error('Twilio not configured');
  return twilioClient.messages.create({
    body: `Your Pawnderr OTP is ${otp}. Expires in 5 minutes.`,
    from: process.env.TWILIO_PHONE,
    to: phone
  });
}

export async function sendOtpEmail(email, otp) {
  
  const params = {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: { Data: 'Pawnderr OTP' },
      Body: {
        Html: { Data: `<p>Your Pawnderr OTP is <b>${otp}</b>. Expires in 5 minutes.</p>` },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    const result = await ses.send(command);
    console.log("Email sent:", result.MessageId);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }

}

export async function sendResetLink(email, token) {
  
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  // Send email via AWS SES
    const params = {
      Source: process.env.EMAIL_FROM,
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: "Password Reset Request" },
        Body: {
          Text: {
            Data: `You requested a password reset. Click here to reset your password:\n\n${resetUrl}\n\nThis link will expire in 15 minutes.`,
          },
        },
      },
    };

    try {
    const command = new SendEmailCommand(params);
    const result = await ses.send(command);
    console.log("Email sent:", result.MessageId);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }

}