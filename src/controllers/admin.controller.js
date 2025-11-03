// src/controllers/admin.controller.js
import express from 'express';
import {
  getAllUsersAdminService,
  getUserByIdAdminService,
  updateUserAdminService,
  deleteUserAdminService,
  getDashboardStatsService,
  resetUserPasswordAdminService
} from '../services/admin.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { adminAuthMiddleware } from '../middleware/admin.middleware.js';

const router = express.Router();

// All routes require admin authentication
router.use(...adminAuthMiddleware);

// Get dashboard statistics
router.get('/dashboard/stats', async (req, res, next) => {
  try {
    const stats = await getDashboardStatsService();
    res.status(200).json(new ApiResponse(true, 'Dashboard stats fetched', stats));
  } catch (error) {
    next(error);
  }
});

// Get all users with pagination
router.get('/users', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await getAllUsersAdminService(page, limit);
    res.status(200).json(new ApiResponse(true, 'Users fetched', result));
  } catch (error) {
    next(error);
  }
});

// Get user by ID
router.get('/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserByIdAdminService(id);
    
    if (!user) {
      return res.status(404).json(new ApiResponse(false, 'User not found', null));
    }
    
    res.status(200).json(new ApiResponse(true, 'User fetched', user));
  } catch (error) {
    next(error);
  }
});

// Update user (admin can update any user)
router.put('/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await updateUserAdminService(id, req.body);
    
    if (!user) {
      return res.status(404).json(new ApiResponse(false, 'User not found', null));
    }
    
    res.status(200).json(new ApiResponse(true, 'User updated', user));
  } catch (error) {
    next(error);
  }
});

// Delete user
router.delete('/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json(new ApiResponse(false, 'Cannot delete your own account', null));
    }
    
    const deletedUser = await deleteUserAdminService(id);
    
    if (!deletedUser) {
      return res.status(404).json(new ApiResponse(false, 'User not found', null));
    }
    
    res.status(200).json(new ApiResponse(true, 'User deleted', deletedUser));
  } catch (error) {
    next(error);
  }
});

// Reset user password
router.post('/users/:id/reset-password', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json(new ApiResponse(false, 'Password must be at least 6 characters', null));
    }
    
    const user = await resetUserPasswordAdminService(id, newPassword);
    
    if (!user) {
      return res.status(404).json(new ApiResponse(false, 'User not found', null));
    }
    
    res.status(200).json(new ApiResponse(true, 'Password reset successfully', { userId: user.id, email: user.email }));
  } catch (error) {
    next(error);
  }
});

export default router;

