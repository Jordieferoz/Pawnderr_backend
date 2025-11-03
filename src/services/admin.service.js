// src/services/admin.service.js
import { varOcg } from '../db.js';
import bcrypt from 'bcrypt';

/**
 * Get all users with pagination
 */
export const getAllUsersAdminService = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    
    // Get total count
    const countResult = await varOcg.query('SELECT COUNT(*) FROM users');
    const total = parseInt(countResult.rows[0].count);
    
    // Get users with pagination
    const { rows } = await varOcg.query(
      `SELECT id, email, phone, name, email_verified, is_admin, role, created_at, updated_at 
       FROM users 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return {
      users: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get user by ID (admin view)
 */
export const getUserByIdAdminService = async (userId) => {
  try {
    const { rows } = await varOcg.query(
      `SELECT id, email, phone, name, email_verified, is_admin, role, created_at, updated_at 
       FROM users 
       WHERE id = $1`,
      [userId]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
};

/**
 * Update user (admin can update any user)
 */
export const updateUserAdminService = async (userId, updateData) => {
  const { phone, name, email, is_admin, role, email_verified } = updateData;
  
  try {
    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (phone !== undefined) {
      updates.push(`phone = $${paramIndex}`);
      values.push(phone);
      paramIndex++;
    }
    if (name !== undefined) {
      updates.push(`name = $${paramIndex}`);
      values.push(name);
      paramIndex++;
    }
    if (email !== undefined) {
      updates.push(`email = $${paramIndex}`);
      values.push(email);
      paramIndex++;
    }
    if (is_admin !== undefined) {
      updates.push(`is_admin = $${paramIndex}`);
      values.push(is_admin);
      paramIndex++;
    }
    if (role !== undefined) {
      updates.push(`role = $${paramIndex}`);
      values.push(role);
      paramIndex++;
    }
    if (email_verified !== undefined) {
      updates.push(`email_verified = $${paramIndex}`);
      values.push(email_verified);
      paramIndex++;
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    updates.push(`updated_at = NOW()`);
    values.push(userId);

    const { rows } = await varOcg.query(
      `UPDATE users 
       SET ${updates.join(', ')} 
       WHERE id = $${paramIndex} 
       RETURNING id, email, phone, name, email_verified, is_admin, role, created_at, updated_at`,
      values
    );

    return rows[0];
  } catch (error) {
    throw error;
  }
};

/**
 * Delete user (admin only)
 */
export const deleteUserAdminService = async (userId) => {
  try {
    const { rows } = await varOcg.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, email',
      [userId]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
};

/**
 * Get dashboard statistics
 */
export const getDashboardStatsService = async () => {
  try {
    // Get total users count
    const usersCount = await varOcg.query('SELECT COUNT(*) FROM users');
    const totalUsers = parseInt(usersCount.rows[0].count);

    // Get verified users count
    const verifiedCount = await varOcg.query('SELECT COUNT(*) FROM users WHERE email_verified = true');
    const verifiedUsers = parseInt(verifiedCount.rows[0].count);

    // Get admin users count
    const adminCount = await varOcg.query('SELECT COUNT(*) FROM users WHERE is_admin = true OR role = $1', ['admin']);
    const adminUsers = parseInt(adminCount.rows[0].count);

    // Get users created in last 30 days
    const recentUsers = await varOcg.query(
      `SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '30 days'`
    );
    const newUsers = parseInt(recentUsers.rows[0].count);

    return {
      totalUsers,
      verifiedUsers,
      unverifiedUsers: totalUsers - verifiedUsers,
      adminUsers,
      regularUsers: totalUsers - adminUsers,
      newUsersLast30Days: newUsers
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Reset user password (admin only)
 */
export const resetUserPasswordAdminService = async (userId, newPassword) => {
  try {
    const passwordHash = await bcrypt.hash(newPassword, 12);
    
    const { rows } = await varOcg.query(
      `UPDATE users 
       SET password_hash = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING id, email`,
      [passwordHash, userId]
    );

    return rows[0];
  } catch (error) {
    throw error;
  }
};

