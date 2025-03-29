import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({ success: true, message: 'Successfully connected to MongoDB' });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    return NextResponse.json({ success: false, error: 'Failed to connect to MongoDB' }, { status: 500 });
  }
} 