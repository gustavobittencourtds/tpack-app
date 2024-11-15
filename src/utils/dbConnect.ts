// src/utils/dbConnect.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.DB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    'Por favor, defina a variável DB_URI no arquivo .env'
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
