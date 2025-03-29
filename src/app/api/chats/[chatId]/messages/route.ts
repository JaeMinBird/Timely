import { connectToDatabase } from '@/lib/mongodb';
import { Chat } from '@/models/Chat';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../../auth/[...nextauth]/route';

// Add a new message to a chat
export async function POST(req: NextRequest, { params }: { params: { chatId: string } }) {
  try {
    await connectToDatabase();
    
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id || session.user.email;
    const chatId = params.chatId;
    const { role, content } = await req.json();
    
    if (!role || !content) {
      return NextResponse.json({ error: 'Role and content are required' }, { status: 400 });
    }
    
    const chat = await Chat.findOne({ _id: chatId, userId });
    
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }
    
    const newMessage = {
      role,
      content,
      timestamp: new Date()
    };
    
    chat.messages.push(newMessage);
    chat.updatedAt = new Date();
    
    await chat.save();
    
    return NextResponse.json(newMessage);
  } catch (error) {
    console.error('Error adding message:', error);
    return NextResponse.json({ error: 'Failed to add message' }, { status: 500 });
  }
} 