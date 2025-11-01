import { varOcg } from '../db.js';
import bcrypt from 'bcrypt';

export const createUserService = async (userData) => {
  const { email, password, phone, name } = userData;
  
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  try {
    // Check if user already exists
    const existingUser = await varOcg.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Insert user
    const { rows } = await varOcg.query(
      `INSERT INTO users(email, password_hash, phone, name) 
       VALUES($1, $2, $3, $4) 
       RETURNING id, email, phone, name, email_verified, created_at`,
      [email, passwordHash, phone, name]
    );

    return rows[0];
  } catch (error) {
    throw error;
  }
};

export const getAllUsersService = async () => {
  try {
    const { rows } = await varOcg.query(
      'SELECT id, email, phone, name, email_verified, created_at FROM users ORDER BY created_at DESC'
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

export const getUserByIdService = async (userId) => {
  try {
    const { rows } = await varOcg.query(
      'SELECT id, email, phone, name, email_verified, created_at FROM users WHERE id = $1',
      [userId]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
};

export const updateUserService = async (userId, updateData) => {
  const { phone, name } = updateData;
  
  try {
    const { rows } = await varOcg.query(
      `UPDATE users SET phone = $1, name = $2 
       WHERE id = $3 
       RETURNING id, email, phone, name, email_verified, updated_at`,
      [phone, name, userId]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
};

