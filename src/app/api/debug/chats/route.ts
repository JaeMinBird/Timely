import { connectToDatabase } from '@/lib/mongodb';
import { Chat } from '@/models/Chat';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Get up to 50 chats (limit for debugging)
    const allChats = await Chat.find({}).limit(50);
    
    return NextResponse.json({
      totalChats: allChats.length,
      chats: allChats.map(chat => ({
        id: chat._id.toString(),
        userId: chat.userId,
        title: chat.title,
        messageCount: chat.messages?.length || 0,
        createdAt: chat.createdAt,
        messages: chat.messages?.map((msg: any) => ({
          role: msg.role,
          contentPreview: msg.content.substring(0, 50) + (msg.content.length > 50 ? '...' : '')
        }))
      }))
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: 'Debug error' }, { status: 500 });
  }
} 