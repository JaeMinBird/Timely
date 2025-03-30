import { openai } from '@ai-sdk/openai';
import { generateObject, CoreMessage } from 'ai';
import { calendarSchema } from './schemas';
import { type DefaultSession } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { NextRequest, NextResponse } from 'next/server'
// import dotenv from 'dotenv';
// import {authenticate} from '@google-cloud/local-auth';
// import {google} from 'googleapis';
// import fs from 'fs/promises';
// import path from 'path';
// import process from 'process';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Get the messages from the request
    const messages = await req.json();

    // Get the session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.accessToken) {
      console.error('No session or access token available:', session);
      return NextResponse.json({ error: 'Unauthorized or missing Google access token' }, { status: 401 });
    }

    const now = new Date();
    const tomorrow = new Date(now.getTime() + 86400000);
    const dayAfterTomorrow = new Date(now.getTime() + 172800000);

    // Add the system message
    const systemMessage: CoreMessage = {
      role: 'system',
      content:
        `You are a helpful assistant that helps users manage their tasks and calendar events.

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
2. Make firm assumptions rather than asking for clarification on dates.`,
    };

    // Check if messages is an array before using array methods
    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request format. Expected array of messages.' },
        { status: 400 }
      );
    }

    // Create a new array with the system message first
    const allMessages = [systemMessage, ...messages];

    // Extract calendar events from the conversation
    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      messages: allMessages,
      schema: calendarSchema
    });

    // Create the events in the user's Google Calendar
    const createdEvents = [];
    for (const eventData of object.events) {
      try {      
        // Add 4 hours to both the start and end times
        const startDateTime = new Date(eventData.start.dateTime);
        const endDateTime = new Date(eventData.end.dateTime);
        
        // Add 4 hours (4 * 60 * 60 * 1000 milliseconds)
        startDateTime.setTime(startDateTime.getTime() + 0 * 60 * 60 * 1000);
        endDateTime.setTime(endDateTime.getTime() + 0 * 60 * 60 * 1000);
        
        // Update the event data with the new times
        const adjustedEventData = {
          ...eventData,
          start: {
            ...eventData.start,
            dateTime: startDateTime.toISOString()
          },
          end: {
            ...eventData.end,
            dateTime: endDateTime.toISOString()
          }
        };

        const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify(adjustedEventData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to create event');
        }
        
        const data = await response.json();
        createdEvents.push(data);
      } catch (error) {
        console.error('Error creating calendar event:', error);
        return NextResponse.json(
          { error: error instanceof Error ? error.message : 'Unknown error' }, 
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      status: 'success',
      message: `Created ${createdEvents.length} events in your calendar`,
      events: createdEvents
    });
  } catch (error) {
    console.error('Error in calendar export:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error processing calendar export' },
      { status: 500 }
    );
  }
}