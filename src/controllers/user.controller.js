// src/controllers/user.controller.js
import express from 'express';
import { createUserService, getAllUsersService, getUserByIdService, updateUserService } from "../services/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Create user
router.post('/', async (req, res, next) => {
  try {
    const user = await createUserService(req.body);
    res.status(201).json(new ApiResponse(true, "User created", user));
  } catch (error) {
    next(error);
  }
});

// Get all users (protected)
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json(new ApiResponse(true, "Users fetched", users));
  } catch (error) {
    next(error);
  }
});

// Get current user profile (protected) - Must come before /:id route
router.get('/me/profile', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await getUserByIdService(userId);
    
    if (!user) {
      return res.status(404).json(new ApiResponse(false, "User not found", null));
    }
    
    res.status(200).json(new ApiResponse(true, "Profile fetched", user));
  } catch (error) {
    next(error);
  }
});

// Get user by ID (protected)
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserByIdService(id);
    
    if (!user) {
      return res.status(404).json(new ApiResponse(false, "User not found", null));
    }
    
    res.status(200).json(new ApiResponse(true, "User fetched", user));
  } catch (error) {
    next(error);
  }
});

// Update current user profile (protected) - Must come before /:id route
router.put('/me/profile', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await updateUserService(userId, req.body);
    
    if (!user) {
      return res.status(404).json(new ApiResponse(false, "User not found", null));
    }
    
    res.status(200).json(new ApiResponse(true, "Profile updated", user));
  } catch (error) {
    next(error);
  }
});

// Update user (protected)
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Users can only update their own profile
    if (parseInt(id) !== userId) {
      return res.status(403).json(new ApiResponse(false, "Forbidden: You can only update your own profile", null));
    }
    
    const user = await updateUserService(id, req.body);
    
    if (!user) {
      return res.status(404).json(new ApiResponse(false, "User not found", null));
    }
    
    res.status(200).json(new ApiResponse(true, "User updated", user));
  } catch (error) {
    next(error);
  }
});

export default router;
