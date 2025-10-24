// src/app.js
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './auth/auth.controller.js';

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use('/auth', authRoutes);


// health
app.get('/health', (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Pawnderr backend listening on ${port}`));
