import { generateText, generateObject, CoreMessage } from 'ai';
import { calendarSchema } from './schemas';
import { createOpenAI } from '@ai-sdk/openai';
import {config} from 'dotenv';

config({path: '.env.local'});

const openai = createOpenAI({
  // custom settings, e.g.
  compatibility: 'strict', // strict mode, enable when using the OpenAI API
  apiKey: process.env.OPENAI_API_KEY
});


(async function createSchedule() {
  const systemMessage: CoreMessage = {
    role: 'system',
    content:
      'You are a scheduling assistant meant to create event schedules which can be exported to calendar apps such as Google Calendar. You need to make sure that all of the events can be scheduled and at every output you show the entire current schedule in full detail.',
  };

  const messages: CoreMessage[] = [
    systemMessage,
    {
      role: 'user',
      content: 'Create a 3-day-a-week gym schedule.',
    },
  ];

  // Generate text response
  const result = await generateText({
    model: openai('gpt-4o-mini'),
    messages: messages,
  });

  messages.push({
    role: 'user',
    content: result.response.messages[0].content[0].toString(),
  });

  // Generate object based on the schema
  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    messages: messages,
    schema: calendarSchema,
  });

  console.log('Generated Object:', object.events);
})();

