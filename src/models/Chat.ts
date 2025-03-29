import mongoose, { Schema, Document, Model } from 'mongoose';

// Message interface
export interface IMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

// Calendar event interface
export interface ICalendarEvent {
  summary: string;
  location?: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  recurrence?: string[];
  attendees?: { email: string }[];
  reminders?: {
    useDefault: boolean;
    overrides?: { method: string; minutes: number }[];
  };
}

// Chat interface
export interface IChat extends Document {
  userId: string;
  title: string;
  messages: IMessage[];
  calendarEvents?: ICalendarEvent[];
  createdAt: Date;
  updatedAt: Date;
}

// Message schema
const MessageSchema = new Schema<IMessage>({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Calendar event schema
const CalendarEventSchema = new Schema({
  summary: { type: String, required: true },
  location: String,
  description: String,
  start: {
    dateTime: { type: String, required: true },
    timeZone: { type: String, required: true }
  },
  end: {
    dateTime: { type: String, required: true },
    timeZone: { type: String, required: true }
  },
  recurrence: [String],
  attendees: [
    {
      email: String
    }
  ],
  reminders: {
    useDefault: { type: Boolean, default: false },
    overrides: [
      {
        method: String,
        minutes: Number
      }
    ]
  }
});

// Chat schema
const ChatSchema = new Schema<IChat>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    default: 'New Chat'
  },
  messages: [MessageSchema],
  calendarEvents: [CalendarEventSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create or retrieve the Chat model
export const Chat = mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema); 