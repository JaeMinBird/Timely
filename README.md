# Timely - AI Calendar Assistant
Author: JaeMin Birdsall and Neil Chattopadhyay
Date: March 29-30, 2024 (HackPSU 24-Hour Project)

## Overview
Timely is a modern calendar assistant built during HackPSU 2024, completed in under 24 hours. The project combines AI-powered conversation capabilities with seamless calendar integration, offering users a natural language interface for schedule management.

## Natural Language Planning
At the core of Timely is its natural language processing capability, allowing users to manage their calendar through conversational commands. The system interprets casual text and converts it into structured calendar events.

### How it Works
![Lunch Scheduling Demo](/public/gifs/Lunch.gif)

Behind the scenes:
1. Text Analysis → Extract event details
   - Type: Meal (lunch)
   - Participant: Alex
   - Time: 1:00 PM
   - Duration: 1 hour (default for lunch)

2. Context Enhancement
   - Date: Current date (if not specified)
   - Location: Default or previous meeting location
   - Duration: Smart defaults based on event type

### Natural Time Parsing
Supports various time formats:
- Exact times: "at 3pm", "10:30"
- Relative times: "in an hour", "tomorrow afternoon"
- Fuzzy times: "morning", "after lunch"
- Time zones: Automatic conversion based on participant locations

### Key Features
1. Natural Language Processing for schedule management
2. Real-time chat interface
3. Calendar synchronization
4. Cross-device persistence
5. Responsive design for mobile and desktop

## Architecture

### Frontend Stack
- React 18
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Framer Motion for animations

### Backend Architecture

#### Authentication & Calendar Integration
- **NextAuth.js Integration**
  - Google OAuth2.0 provider
  - Secure session management
  - Persistent user sessions
  
- **Google Calendar API**
  - Real-time calendar synchronization
  - Event creation/modification
  - Calendar access management
  - GCP project integration for API access

#### AI Chat System
- **AI-SDK Implementation**
  - Hot-swappable AI model architecture
  - Supported Models:
    - OpenAI GPT-4
    - Google Gemini
  - Real-time model switching
  - Consistent response formatting
  - Context preservation across models

#### Data Persistence
- **MongoDB Integration**
  - Mongoose ODM for schema management
  - Collections:
    - User profiles
    - Chat histories
    - Calendar preferences
  - CRUD Operations:
    - Chat creation/retrieval
    - Message history persistence
    - User settings management

#### Message & Chat History Storage
- **MongoDB Integration**
  - Mongoose ODM for schema management
  - Collections:
    ```typescript
    // Chat Schema
    interface Chat {
      id: string;
      userId: string;
      title: string;
      createdAt: Date;
      updatedAt: Date;
      messages: Message[];
    }

    // Message Schema
    interface Message {
      id: string;
      role: 'user' | 'assistant';
      content: string;
      timestamp: Date;
      metadata?: {
        eventDetails?: CalendarEvent;
        modelProvider?: 'openai' | 'gemini';
      }
    }
    ```
  - CRUD Operations:
    - Create new chat sessions
    - Append messages to existing chats
    - Retrieve chat history with pagination
    - Update chat titles and metadata
    - Delete conversations
  - Indexing:
    - Optimized queries by userId
    - Timestamp-based sorting
    - Full-text search capabilities

### API Routes Structure
```plaintext
/api
├── auth/        # Authentication endpoints
├── calendar/    # Calendar integration endpoints
├── chat/        # AI chat interaction endpoints
├── debug/       # Development testing endpoints
└── test-db/     # Database testing endpoints
```

### Authentication Flow
1. User initiates Google OAuth login
2. NextAuth handles OAuth2.0 flow
3. Receives Google Calendar scope permissions
4. Creates/updates user session
5. Stores refresh token for calendar access

### Calendar Integration Process
1. User sends natural language request
2. AI processes scheduling intent
3. Calendar API checks availability
4. Creates/modifies events
5. Returns confirmation with event details
6. Updates chat history with event metadata

### AI Model Implementation
```typescript
// Model Provider Interface
interface AIModelProvider {
  generateResponse(
    messages: Message[],
    context: ChatContext
  ): Promise<AIResponse>;
}

// Hot-swappable Model Selection
const modelProvider = {
  'openai': new OpenAIProvider(config),
  'gemini': new GeminiProvider(config)
};

// Usage in API Route
const response = await modelProvider[selectedModel]
  .generateResponse(messages, context);
```

## Component Architecture

### Chat Interface
The chat interface consists of several key components:
- ChatPage: Main container component
- ChatSidebar: Collapsible sidebar for chat history
- ChatList: Previous conversations display
- Message Display Area: Ongoing conversation view
- Input Area: User message entry
- CalendarEventCard: Event display component

### State Management
- Dual storage implementation:
  - localStorage for immediate availability
  - MongoDB for cross-device persistence
- Real-time state updates
- Session management

## User Interface

### Landing Page
[Would you like me to include placeholder sections for desktop/mobile screenshots of the landing page?]

The landing page features four key demonstrations:

1. Natural Language Planning
   - Video: ex1.webm
   - Demonstrates intuitive text-based scheduling

2. [What would you like to include for ex2.webm?]

3. [What would you like to include for ex3.webm?]

4. Calendar Sync Demo
   - Video: ex4.webm
   - Shows calendar integration capabilities

### Chat Interface
[Would you like me to include placeholder sections for desktop/mobile screenshots of the chat interface?]

## Responsive Design
The application implements a sophisticated responsive design approach:

### Desktop
- Expandable sidebar with full labels
- Multi-column layout
- Hover states and desktop-specific interactions

### Mobile
- Collapsible hamburger menu
- Touch-optimized controls
- Single-column layout
- Optimized spacing for mobile viewports

## Animation System
Implemented using Framer Motion:
- Smooth sidebar transitions
- Message appearance animations
- Success feedback animations
- Modal transitions

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Future Enhancements
- Enhanced message formatting
- Drag-and-drop event rescheduling
- Voice input support
- Improved offline capabilities
- Enhanced accessibility features

## Deployment
The application is optimized for deployment on Vercel, leveraging:
- Edge Functions
- Image Optimization
- Automatic HTTPS
- CI/CD Integration

## Development Timeline
- **March 29, 2024**: Project initiated at HackPSU
- **March 30, 2024**: Completed within 24-hour deadline
  - Core functionality implementation
  - UI/UX design and development
  - Backend integration
  - Testing and deployment

[Would you like me to add specific implementation details for any of the API routes or backend systems?]
