import { openai } from '@ai-sdk/openai';
import { generateText, streamText } from 'ai';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const systemMessage = {
    role: 'system', 
    content: 'You are a scheduling assistant meant to crete event schedules which can be exported to calendar apps such as google calendar, you need to make sure that all of the events have enough information to be scheduled make sure that at every output you show the entire current schedule in full detail'
  };

  const { messages } = await req.json();
  messages.unshift(systemMessage);

  const result = streamText({
    model: openai('gpt-4o'),
    messages
  });

  return result.toDataStreamResponse();
}

