// src/app.js
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './auth/auth.controller.js';
import dogsRoutes from './dogs/dogs.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use('/auth', authRoutes);
app.use('/dogs', dogsRoutes);


// health
app.get('/health', (req, res) => res.json({ ok: true }));

// error handler middleware (must be last)
app.use(errorHandler);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Pawnderr backend listening on ${port}`));
