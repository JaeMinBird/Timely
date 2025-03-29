import { connectToDatabase } from '@/lib/mongodb';
import { Chat } from '@/models/Chat';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { chatId, message } = await req.json();
    
    if (!chatId || !message) {
      return NextResponse.json({ 
        error: 'Chat ID and message are required',
        received: { chatId: Boolean(chatId), message: Boolean(message) }
      }, { status: 400 });
    }
    
    const userId = session.user.id || session.user.email;
    console.log(`AI API: Looking for chat ${chatId} for user ${userId}`);
    
    // Verify the chat belongs to the user
    const chat = await Chat.findOne({ _id: chatId, userId });
    
    if (!chat) {
      return NextResponse.json({ 
        error: 'Chat not found', 
        chatId,
        userId
      }, { status: 404 });
    }
    
    console.log(`AI API: Chat found, generating response for message: ${message.substring(0, 30)}...`);
    
    // Here you would call your AI service to process the message
    // For this example, we're returning a mock response
    const aiResponse = `This is a response to: "${message}". In production, you would connect to an actual AI API.`;
    
    // Check for calendar-related keywords
    let detectedEvent = null;
    if (message.toLowerCase().includes('schedule') || message.toLowerCase().includes('calendar')) {
      // This is a simplified example - in a real app, you'd use more sophisticated extraction
      detectedEvent = {
        summary: 'Sample Event',
        description: 'Event extracted from conversation',
        start: {
          dateTime: new Date().toISOString(),
          timeZone: 'America/Los_Angeles',
        },
        end: {
          dateTime: new Date(Date.now() + 3600000).toISOString(),
          timeZone: 'America/Los_Angeles',
        }
      };
      
      // Add the detected event to the chat
      if (detectedEvent) {
        chat.calendarEvents = chat.calendarEvents || [];
        chat.calendarEvents.push(detectedEvent);
        await chat.save();
      }
    }
    
    return NextResponse.json({ 
      response: aiResponse,
      detectedEvent
    });
  } catch (error) {
    console.error('Error processing AI request:', error);
    return NextResponse.json({ error: 'Failed to process AI request' }, { status: 500 });
  }
} 