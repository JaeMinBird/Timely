import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Global mongoose connection cache type
 */
interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/**
 * Global mongoose connection cache to prevent multiple connections during development
 */
declare global {
  // This is an interface merging declaration
  var mongooseConnection: MongooseConnection | null;
}

// Initialize the global cache if it doesn't exist
if (!global.mongooseConnection) {
  global.mongooseConnection = {
    conn: null,
    promise: null
  };
}

// At this point we know mongooseConnection is initialized
const cache: MongooseConnection = global.mongooseConnection as MongooseConnection;

/**
 * Connects to MongoDB and returns the mongoose instance
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  console.log("Attempting to connect to MongoDB...");

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
} 