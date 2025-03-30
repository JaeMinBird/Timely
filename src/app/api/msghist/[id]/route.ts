import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Chat } from '@/models/Chat';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET handler to fetch a specific chat
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Get the chat ID from the URL - no need to await params
    const chatId = params.id;
    
    // Get the current user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the user ID from the session
    const userId = session.user.email;
    
    // Fetch the chat
    const chat = await Chat.findOne({ _id: chatId, userId }).lean();
    
    // If the chat doesn't exist or doesn't belong to this user
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }
    
    // Return the chat
    return NextResponse.json(chat);
  } catch (error) {
    console.error('Error fetching chat:', error);
    return NextResponse.json({ error: 'Failed to fetch chat' }, { status: 500 });
  }
}

// PUT handler to update a chat (for renaming)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Get the chat ID from the URL
    const chatId = params.id;
    
    // Get the current user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the user ID from the session
    const userId = session.user.email;
    
    // Get the request body
    const body = await req.json();
    
    // Update the chat
    const updatedChat = await Chat.findOneAndUpdate(
      { _id: chatId, userId },
      { 
        $set: { 
          title: body.title,
          updatedAt: new Date()
        } 
      },
      { new: true }
    );
    
    // If the chat doesn't exist or doesn't belong to this user
    if (!updatedChat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }
    
    // Return the updated chat
    return NextResponse.json(updatedChat);
  } catch (error) {
    console.error('Error updating chat:', error);
    return NextResponse.json({ error: 'Failed to update chat' }, { status: 500 });
  }
}

// DELETE handler to delete a chat
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Get the chat ID from the URL
    const chatId = params.id;
    
    // Get the current user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the user ID from the session
    const userId = session.user.email;
    
    // Delete the chat
    const result = await Chat.deleteOne({ _id: chatId, userId });
    
    // If the chat doesn't exist or doesn't belong to this user
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }
    
    // Return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat:', error);
    return NextResponse.json({ error: 'Failed to delete chat' }, { status: 500 });
  }
} 