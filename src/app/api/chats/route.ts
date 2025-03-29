import { connectToDatabase } from '@/lib/mongodb';
import { Chat } from '@/models/Chat';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';

// Get all chats for the current user
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id || session.user.email;
    
    const chats = await Chat.find({ userId })
      .sort({ updatedAt: -1 })
      .select('title createdAt updatedAt');
    
    return NextResponse.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
  }
}

// Create a new chat
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id || session.user.email;
    const data = await req.json();
    
    const newChat = new Chat({
      userId,
      title: data.title || 'New Chat',
      messages: data.messages || [],
      calendarEvents: data.calendarEvents || []
    });
    
    await newChat.save();
    
    return NextResponse.json(newChat);
  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json({ error: 'Failed to create chat' }, { status: 500 });
  }
} 