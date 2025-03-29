// This file can be safely deleted as the type declaration is now in mongodb.ts 

import mongoose from 'mongoose';

declare global {
  var mongooseConnection: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | null;
} 