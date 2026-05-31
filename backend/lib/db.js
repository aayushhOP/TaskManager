import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/** Strip accidental quotes from .env or Vercel env values */
export function normalizeMongoUri(uri) {
  if (!uri) return uri;
  return uri.trim().replace(/^["']|["']$/g, '');
}

export default async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  const uri = normalizeMongoUri(process.env.MONGODB_URI);
  if (!uri) {
    throw new Error('MONGODB_URI is not defined. Add it to backend/.env or Vercel env vars.');
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((mongooseInstance) => {
        console.log('connected to db');
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;
        console.error('MongoDB connection failed:', err.message);
        if (err.message?.includes('authentication failed')) {
          console.error('Hint: Check Atlas username/password. URL-encode special characters in the password.');
        }
        if (err.message?.includes('ENOTFOUND') || err.message?.includes('querySrv')) {
          console.error('Hint: Check the cluster hostname in MONGODB_URI and your internet connection.');
        }
        if (err.message?.includes('timed out') || err.message?.includes('ETIMEDOUT')) {
          console.error('Hint: In Atlas → Network Access, allow 0.0.0.0/0 (or your current IP).');
        }
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
