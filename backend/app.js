import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './lib/db.js';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

function getAllowedOrigins() {
  const origins = [
    process.env.CLIENT_URL,
    ...(process.env.CLIENT_URLS?.split(',').map((o) => o.trim()) || []),
  ].filter(Boolean);

  if (origins.length === 0 && process.env.NODE_ENV !== 'production') {
    origins.push('http://localhost:5173');
  }

  return [...new Set(origins)];
}

function isOriginAllowed(origin) {
  if (!origin) return true;

  const allowed = getAllowedOrigins();
  if (allowed.includes(origin)) return true;

  if (process.env.ALLOW_VERCEL_PREVIEWS === 'true') {
    try {
      const { hostname } = new URL(origin);
      return hostname.endsWith('.vercel.app');
    } catch {
      return false;
    }
  }

  return false;
}

app.use(
  cors({
    origin(origin, callback) {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
  })
);

app.options('*', cors());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Task Manager API is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
