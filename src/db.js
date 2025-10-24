// src/db.js
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// __define-ocg__: Postgres pool (varOcg)
export const varOcg = new Pool({
  connectionString: process.env.DATABASE_URL,
});
