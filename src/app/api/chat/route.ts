import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Chat } from '@/models/Chat';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { generateText, CoreMessage } from 'ai';

// Helper function to generate consistent system prompt with current date
function getSystemPrompt() {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 86400000);
  const dayAfterTomorrow = new Date(now.getTime() + 172800000);
  
  return `You are a helpful assistant that helps users manage their tasks and calendar events.

IMPORTANT INSTRUCTION: NEVER ask for clarification on dates. You MUST interpret all time references yourself.

Current date/time: ${now.toLocaleString('en-US', { timeZone: 'America/New_York', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}

Use these EXACT interpretations for date references:
- "today" = ${now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
- "tomorrow", "tmrw", "tmw", "tom" = ${tomorrow.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
- "day after tomorrow" = ${dayAfterTomorrow.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}

For missing information:
- If end time is missing but start time is provided, ask ONLY for the end time
- If start time is missing, assume it is at the current time
- NEVER ask for the DATE again if any relative date words are used

Response format:
1. When all information is complete, respond with: "[Event] scheduled for [specific day, month date, year] from [start time] to [end time]. Added to your Calendar."
2. Make firm assumptions rather than asking for clarification on dates.`;
}

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
      // Get conversation history if provided
      const history = body.history || [];
      
      // Prepare messages for the AI
      let messages: CoreMessage[] = [];
      
      // If we have history, use it, otherwise just create a new conversation
      if (history.length > 0) {
        // If history exists but doesn't have a system message as first message, add it
        if (history[0]?.role !== 'system') {
          messages.push({
            role: 'system',
            content: getSystemPrompt()
          });
          // Then add the existing history
          messages.push(...history);
        } else {
          // History already has a system message, use as is
          messages = history;
        }
      } else {
        // This is a new conversation, add the system message
        messages.push({
          role: 'system',
          content: getSystemPrompt()
        });
      }
      
      // Add the new user message
      messages.push({
        role: 'user',
        content: body.message
      });
      
      // Generate response using the selected model provider
      const result = await generateText({
        model: body.modelProvider === 'gemini' 
          ? google('gemini-1.5-pro-latest')
          : openai('gpt-4o-mini'),
        messages: messages,
      });
      
      // Extract the response content
      const responseMessage = result.text;
      
      // Add the AI's response to the messages for future context
      messages.push({
        role: 'assistant',
        content: responseMessage
      });
      
      // Return both the response and the updated conversation history
      return NextResponse.json({ 
        message: responseMessage,
        history: messages
      });
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

