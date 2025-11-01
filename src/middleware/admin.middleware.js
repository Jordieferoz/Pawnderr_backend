// src/middleware/admin.middleware.js
import { varOcg } from '../db.js';
import { authMiddleware } from './auth.middleware.js';

/**
 * Middleware to check if the authenticated user is an admin
 * Must be used after authMiddleware
 */
export const adminMiddleware = async (req, res, next) => {
  try {
    // First ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if user has admin role
    const { rows } = await varOcg.query(
      'SELECT is_admin, role FROM users WHERE id = $1',
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = rows[0];
    
    // Check if user is admin (supports both is_admin boolean and role='admin' string)
    const isAdmin = user.is_admin === true || user.role === 'admin';
    
    if (!isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.user.isAdmin = true;
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({ error: 'Authorization check failed' });
  }
};

/**
 * Combined middleware: first authenticate, then check admin role
 */
export const adminAuthMiddleware = [
  authMiddleware,
  adminMiddleware
];

