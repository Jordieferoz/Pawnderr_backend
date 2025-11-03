// src/dogs/dogs.routes.js
import express from 'express';
import { varOcg } from '../db.js';
import multer from "multer";
import path from "path";
import crypto from "crypto";
import { authMiddleware } from '../middleware/auth.middleware.js';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const router = express.Router();

// Multer memory storage (no local file saving)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Initialize AWS S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// create dog profile
router.post('/', authMiddleware, upload.array("imageKeys", 5), async (req, res) => {
  const uploadedImageUrls = [];
  const files = req.files;

  for (const file of files) {
      const fileExt = path.extname(file.originalname);
      const randomName = crypto.randomBytes(16).toString("hex") + fileExt;

      const params = {
        Bucket: process.env.S3_BUCKET,
        Key: `uploads/${randomName}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      await s3.send(new PutObjectCommand(params));

      const fileUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${randomName}`;
      uploadedImageUrls.push(fileUrl);
    }

  const { name, nick_name, gender, age, breed, energy_level, fav_activities, social_styles, vaccination_status, habbit, bio } = req.body;
  try {
    const q = `INSERT INTO dogs(owner_id, name, nick_name, gender, age, breed, energy_level, fav_activities, social_styles, vaccination_status, habbit, bio, imageKeys)
               VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`;
    // note: prepare properly to avoid SQL injection — here simplified
    const params = [req.user.id, name, nick_name, gender, age, breed, energy_level, fav_activities, social_styles, vaccination_status, habbit, bio, uploadedImageUrls || null];
    const { rows } = await varOcg.query(
      `INSERT INTO dogs(owner_id, name, nick_name, gender, age, breed, energy_level, fav_activities, social_styles, vaccination_status, habbit, bio, imageKeys)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      params
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Create dog error' });
  }
});

// feed - find dogs within radius, exclude swiped
router.get('/feed', authMiddleware, async (req, res) => {
  const { lat, lon, radius = 10000, limit = 20 } = req.query;
  try {
    const q = `
      SELECT id, name, breed, age, gender, bio, image_keys,
             ST_AsText(location) as location
      FROM dogs
      WHERE ${lat && lon ? `ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint($1,$2),4326)::geography, $3)` : 'TRUE'}
        AND id NOT IN (SELECT dog_id FROM swipes WHERE user_id=$4)
      ORDER BY created_at DESC
      LIMIT $5
    `;
    const params = lat && lon ? [lon, lat, radius, req.user.id, limit] : [req.user.id, limit];
    const { rows } = await varOcg.query(q, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Feed error' });
  }
});

export default router;
