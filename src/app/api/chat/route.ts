import { openai } from '@ai-sdk/openai';
import { generateText, streamText, CoreMessage } from 'ai';
import { Chat, IMessage } from '@/models/Chat';
import { connectToDatabase } from '@/lib/mongodb';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  // Connect to MongoDB
  await connectToDatabase();
  
  const systemMessage: CoreMessage = {
    role: 'system', 
    content: 'You are a scheduling assistant meant to crete event schedules which can be exported to calendar apps such as google calendar, you need to make sure that all of the events have enough information to be scheduled make sure that at every output you show the entire current schedule in full detail'
  };

  const { messages, chatId, userId } = await req.json();
  
  // Add system message for the AI
  const aiMessages = [...messages];
  aiMessages.unshift(systemMessage);

  // Generate response using AI
  const result = await generateText({
    model: openai('gpt-4o'),
    messages: aiMessages
  });
  
  // Save chat to database
  try {
    // If chatId is provided, find and update existing chat
    if (chatId) {
      // Create message object for only the NEW message (not all messages)
      const lastUserMessage = messages.find((msg: CoreMessage) => msg.role === 'user');
      const lastAiMessage = { role: 'assistant', content: result.text, timestamp: new Date() };
      
      const newMessages = [];
      
      if (lastUserMessage) {
        newMessages.push({
          role: 'user',
          content: lastUserMessage.content,
          timestamp: new Date()
        });
      }
      
      newMessages.push(lastAiMessage);
      
      // Find chat and append ONLY NEW messages
      await Chat.findByIdAndUpdate(
        chatId,
        { 
          $push: { messages: { $each: newMessages } },
          $set: { updatedAt: new Date() }
        },
        { new: true }
      );
      
      // Return a response here too!
      return new Response(JSON.stringify({ 
        text: result.text 
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } 
    // If no chatId, create a new chat
    else if (userId) {
      // Create a new chat with the conversation
      const title = messages.length > 0 ? 
        messages[0].content.substring(0, 30) + '...' : 
        'New Chat';
        
      const chatMessages: IMessage[] = messages.map((msg: CoreMessage) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
        timestamp: new Date()
      }));
      
      const newChat = new Chat({
        userId,
        title,
        messages: chatMessages,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      await newChat.save();
      
      // Add the newly created chat ID to the response
      return new Response(JSON.stringify({ 
        text: result.text,
        chatId: newChat._id 
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Error saving chat to database:', error);
    // Return a response in error case too
    return new Response(JSON.stringify({ 
      text: result.text,
      error: 'Error saving to database'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}