import bcrypt from 'bcrypt';

/**
 * Hash OTP before storing in database
 */
export const hashOtp = (otp) => {
  const saltRounds = 10;
  return bcrypt.hashSync(otp.toString(), saltRounds);
};

/**
 * Compare OTP with hashed OTP
 */
export const compareOtp = async (otp, hashedOtp) => {
  return await bcrypt.compare(otp.toString(), hashedOtp);
};

/**
 * Generate random 6-digit OTP
 */
export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

