import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
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

  // If we have a connection, return it
  if (cache.conn) {
    return cache.conn;
  }

  // If we have a connection in progress, wait for it
  if (cache.promise) {
    try {
      const mongooseInstance = await cache.promise;
      return mongooseInstance;
    } catch (e) {
      cache.promise = null;
      throw e;
    }
  }

  // Start a new connection
  const connectionOptions = {
    bufferCommands: false,
  };

  // Store the connection promise
  cache.promise = mongoose.connect(MONGODB_URI, connectionOptions);

  try {
    // Wait for the connection
    const mongooseInstance = await cache.promise;
    
    // Store the connection
    cache.conn = mongooseInstance;
    
    console.log("MongoDB connection successful!");
    return mongooseInstance;
  } catch (e) {
    console.error("MongoDB connection failed:", e);
    // If there's an error, clear the promise so we'll try again next time
    cache.promise = null;
    throw e;
  }
} 