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

    // Add the system message
    const systemMessage: CoreMessage = {
      role: 'system',
      content:
        'You are a scheduling assistant meant to create event schedules which can be exported to calendar apps such as Google Calendar. You need to make sure that all of the events can be scheduled and at every output you show the entire current schedule in full detail.',
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
        const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify(eventData),
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