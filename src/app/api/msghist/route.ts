import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Chat } from '@/models/Chat';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

// GET handler to fetch all chats for the current user
export async function GET(req: NextRequest) {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Get the current user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the user ID from the session
    const userId = session.user.email;
    
    // Fetch all chats for this user, sorted by most recent
    const chats = await Chat.find({ userId })
      .sort({ updatedAt: -1 })
      .select('_id title createdAt updatedAt')
      .lean();
    
    // Return the chat history
    return NextResponse.json(chats);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json({ error: 'Failed to fetch chat history' }, { status: 500 });
  }
}

// POST handler to create a new chat
export async function POST(req: NextRequest) {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Get the current user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the request body
    const body = await req.json();
    
    // Get the user ID from the session
    const userId = session.user.email;
    
    // Create a new chat
    const newChat = new Chat({
      userId,
      title: body.title || 'New Chat',
      messages: body.messages || [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Save the chat to the database
    await newChat.save();
    
    // Return the new chat
    return NextResponse.json(newChat);
  } catch (error) {
    console.error('Error creating new chat:', error);
    return NextResponse.json({ error: 'Failed to create new chat' }, { status: 500 });
  }
} 