import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Chat } from '@/models/Chat';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { openai } from '@ai-sdk/openai';
import { generateText, CoreMessage } from 'ai';

// GET - Fetch all chats for the current user
export async function GET() {
  try {
    // Get the current authenticated user
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Connect to the database
    await connectToDatabase();
    
    // Find all chats for this user
    const userChats = await Chat.find({ userId: session.user.email })
      .sort({ updatedAt: -1 }) // Sort by most recent first
      .lean();
    
    return NextResponse.json({ chats: userChats });
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
  }
}

// POST - Create a new chat or send a message to OpenAI
export async function POST(request: Request) {
  try {
    // Get the current authenticated user
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Connect to the database
    await connectToDatabase();
    
    // Parse the request body
    const body = await request.json();
    
    // If this is a message to OpenAI, process it
    if (body.message) {
      const systemMessage: CoreMessage = {
        role: 'system',
        content: 'You are a helpful assistant that helps users manage their tasks and calendar events. If prompted with a message that appears to relate to an event, ask the user for the date, and start and end times. If they provide a relative date/time the current time is' + new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }) + ' Once all relevant information is provided say "Added to your Calendar"'
      };
      
      const messages: CoreMessage[] = [
        systemMessage,
        {
          role: 'user',
          content: body.message
        }
      ];
      
      // Generate response using the same API as your calendar endpoint
      const result = await generateText({
        model: openai('gpt-4o-mini'),
        messages: messages,
      });
      
      // Extract the response content
      const responseMessage = result.text;
      
      return NextResponse.json({ message: responseMessage });
    }
    
    // Otherwise, create a new chat
    const newChat = await Chat.create({
      userId: session.user.email,
      title: body.title || 'New Chat',
      messages: [],
      calendarEvents: []
    });
    
    return NextResponse.json(newChat);
  } catch (error) {
    console.error('Error creating chat or processing message:', error);
    return NextResponse.json(
      { error: 'Failed to create chat or process message' }, 
      { status: 500 }
    );
  }
}

// PUT - Update a chat with new messages
export async function PUT(request: Request) {
  try {
    // Get the current authenticated user
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Connect to the database
    await connectToDatabase();
    
    // Parse the request body
    const body = await request.json();
    const { chatId, title, messages } = body;
    
    if (!chatId) {
      return NextResponse.json({ error: 'Chat ID is required' }, { status: 400 });
    }
    
    // Find the chat and ensure it belongs to the current user
    const chat = await Chat.findOne({ 
      _id: chatId,
      userId: session.user.email
    });
    
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }
    
    // Update the chat with new messages and title
    chat.messages = messages;
    if (title) chat.title = title;
    chat.updatedAt = new Date();
    
    // Extract and save any calendar events detected in the messages
    // (This is a placeholder for future calendar integration)
    
    await chat.save();
    
    return NextResponse.json({ success: true, chat });
  } catch (error) {
    console.error('Error updating chat:', error);
    return NextResponse.json({ error: 'Failed to update chat' }, { status: 500 });
  }
}

// PATCH - Update chat properties (like title)
export async function PATCH(request: Request) {
  try {
    // Get the current authenticated user
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Connect to the database
    await connectToDatabase();
    
    // Get the chat ID from query params
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('chatId');
    
    if (!chatId) {
      return NextResponse.json({ error: 'Chat ID is required' }, { status: 400 });
    }
    
    // Parse the request body
    const body = await request.json();
    
    // Find the chat and ensure it belongs to the current user
    const chat = await Chat.findOne({ 
      _id: chatId,
      userId: session.user.email
    });
    
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }
    
    // Update only the fields provided
    if (body.title) chat.title = body.title;
    chat.updatedAt = new Date();
    
    await chat.save();
    
    return NextResponse.json({ success: true, chat });
  } catch (error) {
    console.error('Error updating chat:', error);
    return NextResponse.json({ error: 'Failed to update chat' }, { status: 500 });
  }
}

// DELETE - Delete a chat
export async function DELETE(request: Request) {
  try {
    // Get the current authenticated user
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Connect to the database
    await connectToDatabase();
    
    // Get the chat ID from query params
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('chatId');
    
    if (!chatId) {
      return NextResponse.json({ error: 'Chat ID is required' }, { status: 400 });
    }
    
    // Find and delete the chat, ensuring it belongs to the current user
    const result = await Chat.deleteOne({ 
      _id: chatId,
      userId: session.user.email
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat:', error);
    return NextResponse.json({ error: 'Failed to delete chat' }, { status: 500 });
  }
}

