// src/app.js
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './auth/auth.controller.js';
import userRoutes from './controllers/user.controller.js';
import adminRoutes from './controllers/admin.controller.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);

// health
app.get('/health', (req, res) => res.json({ ok: true }));

// error handler middleware (must be last)
app.use(errorHandler);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Pawnderr backend listening on ${port}`));
