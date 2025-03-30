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
  const messages = await req.json();

  const systemMessage: CoreMessage = {
    role: 'system',
    content:
      'You are a scheduling assistant meant to create event schedules which can be exported to calendar apps such as Google Calendar. You need to make sure that all of the events can be scheduled and at every output you show the entire current schedule in full detail.',
  };

  messages.upshift(systemMessage);

  const calendar = await generateObject({
    model: openai('gpt-4o-mini'),
    prompt: 'Extract the information from this text and turn it into a calendar' + messages,
    schema: calendarSchema
  });

  interface SessionExtension extends DefaultSession {
    accessToken: string;
    refreshToken: string;
  }

  const session = await getServerSession(authOptions) as SessionExtension;
  
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  for(const eventData of calendar.events) {
    try {      
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(eventData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Failed to create event')
      }
      
      // const data = await response.json()

    } catch (error) {
      console.error('Error creating calendar event:', error)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Unknown error' }, 
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ status: 201 });
}

