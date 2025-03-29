import { connectToDatabase } from '@/lib/mongodb';
import { Chat } from '@/models/Chat';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();
    
    // WARNING: Only use this for debugging, remove before production
    const allChats = await Chat.find({});
    
    return NextResponse.json({
      totalChats: allChats.length,
      chats: allChats.map(chat => ({
        id: chat._id,
        userId: chat.userId,
        title: chat.title,
        messageCount: chat.messages.length,
        createdAt: chat.createdAt
      }))
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: 'Debug error' }, { status: 500 });
  }
} 