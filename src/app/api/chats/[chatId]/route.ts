import { connectToDatabase } from '@/lib/mongodb';
import { Chat } from '@/models/Chat';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

// Get a specific chat
export async function GET(req: NextRequest, { params }: { params: { chatId: string } }) {
  try {
    await connectToDatabase();
    
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id || session.user.email;
    const chatId = params.chatId;
    
    const chat = await Chat.findOne({ _id: chatId, userId });
    
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }
    
    return NextResponse.json(chat);
  } catch (error) {
    console.error('Error fetching chat:', error);
    return NextResponse.json({ error: 'Failed to fetch chat' }, { status: 500 });
  }
}

// Update a chat
export async function PUT(req: NextRequest, { params }: { params: { chatId: string } }) {
  try {
    await connectToDatabase();
    
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id || session.user.email;
    const chatId = params.chatId;
    const data = await req.json();
    
    const chat = await Chat.findOne({ _id: chatId, userId });
    
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }
    
    // Update fields
    if (data.title) chat.title = data.title;
    if (data.messages) chat.messages = data.messages;
    if (data.calendarEvents) chat.calendarEvents = data.calendarEvents;
    
    chat.updatedAt = new Date();
    
    await chat.save();
    
    return NextResponse.json(chat);
  } catch (error) {
    console.error('Error updating chat:', error);
    return NextResponse.json({ error: 'Failed to update chat' }, { status: 500 });
  }
}

// Delete a chat
export async function DELETE(req: NextRequest, { params }: { params: { chatId: string } }) {
  try {
    await connectToDatabase();
    
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id || session.user.email;
    const chatId = params.chatId;
    
    const result = await Chat.deleteOne({ _id: chatId, userId });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat:', error);
    return NextResponse.json({ error: 'Failed to delete chat' }, { status: 500 });
  }
} 