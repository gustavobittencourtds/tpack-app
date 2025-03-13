import mongoose from 'mongoose';
import '../models/Choice';
import '../models/Question';

const MONGODB_URI = process.env.DB_URI;

if (!MONGODB_URI) {
  throw new Error('Defina a variável de ambiente DB_URI');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI as string, opts)
      .then(mongoose => {
        console.log('Conectado ao MongoDB');
        return mongoose;
      })
      .catch(error => {
        console.error('Erro ao conectar ao MongoDB:', error);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}