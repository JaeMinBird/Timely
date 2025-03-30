"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import { ChatHistory } from '@/types/chat';
import CalendarEventCard from '@/components/CalendarEventCard';
import ErrorToast from '@/components/ErrorToast';
import { ICalendarEvent } from '@/models/Chat';
import { useChat } from '@ai-sdk/react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
}

// Dynamically import the ChatSidebar with no SSR to avoid hydration issues with animations
const ChatSidebar = dynamic(() => import('@/components/ChatSidebar'), { ssr: false });

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<ICalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  
  // OpenAI chat integration
  const { messages: aiMessages, input, handleInputChange, handleSubmit: handleAiSubmit } = useChat();
  
  // Check for mobile viewport on component mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/');
    }
  }, [status, router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Convert AI SDK messages to our format when they change
  useEffect(() => {
    if (aiMessages.length > 0) {
      const convertedMessages = aiMessages.map(message => ({
        id: message.id,
        content: message.parts.map(part => part.type === 'text' ? part.text : '').join(''),
        isUser: message.role === 'user'
      }));
      
      setMessages(convertedMessages);
    }
  }, [aiMessages]);

  // Handle new chat creation
  const handleNewChat = async () => {
    // If we already have an empty chat (no messages), don't create a new one
    if (currentChatId && messages.length === 0) {
      console.log("Already on an empty chat, not creating a new one");
      // Just focus the input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
      return;
    }

    try {
      setIsLoading(true);
      
      // Create a new chat in the database
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'New Chat',
          messages: [],
        }),
      });

      if (!response.ok) throw new Error('Failed to create new chat');
      
      const newChat = await response.json();
      console.log("New chat created:", newChat);
      
      // Update state with the new chat ID
      setCurrentChatId(newChat._id);
      setMessages([]);
      setInputValue("");
      setCalendarEvents([]);
      
      // Update chat history
      fetchChatHistory();
      
      // Focus on input after clearing messages
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    } catch (error) {
      console.error('Error creating new chat:', error);
      handleError("Failed to create a new chat");
    } finally {
      setIsLoading(false);
    }
  };

  // Keep focus on input after messages change
  useEffect(() => {
    // Small delay to ensure the DOM has updated
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  }, [messages.length]);

  // Modified form submission handler to use AI SDK
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Create a new chat if one doesn't exist yet
    if (!currentChatId) {
      try {
        console.log("Creating new chat...");
        const response = await fetch('/api/chats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: input.substring(0, 30),
            messages: [],
          }),
        });

        if (!response.ok) throw new Error('Failed to create new chat');
        const newChat = await response.json();
        console.log("New chat created:", newChat);
        setCurrentChatId(newChat._id);
        
        // Update chat history
        fetchChatHistory();
      } catch (error) {
        console.error('Error creating new chat:', error);
        handleError("Failed to create a new chat");
        return;
      }
    }
    
    // Use the AI SDK's handleSubmit
    handleAiSubmit(e);
    
    // No need to manually manage messages or loading states as the SDK handles these
  };

  const fetchChatMessages = async (chatId: string) => {
    if (!chatId) {
      console.error('No chat ID provided');
      return;
    }
    
    try {
      console.log(`Fetching messages for chat ${chatId}...`);
      setIsLoading(true);
      
      const response = await fetch(`/api/chats/${chatId}`);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(`Failed to fetch chat messages: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Chat data received:", data);
      
      // Transform messages to match the format expected by the UI
      const formattedMessages = data.messages?.map((msg: any) => ({
        id: msg._id || Date.now().toString(),
        content: msg.content,
        isUser: msg.role === 'user',
      })) || [];
      
      setMessages(formattedMessages);
      setCalendarEvents(data.calendarEvents || []);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      handleError("Failed to load chat messages");
      setMessages([]); // Clear messages on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (message: string) => {
    setError(message);
  };

  // Add this function to fetch chat history
  const fetchChatHistory = async () => {
    try {
      console.log("Fetching chat history...");
      const response = await fetch('/api/chats');
      if (!response.ok) throw new Error('Failed to fetch chat history');
      const data = await response.json();
      console.log("Chat history received:", data);
      setChatHistory(data);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      handleError("Failed to fetch chat history");
    }
  };

  // Load chat history when session is available
  useEffect(() => {
    if (session?.user) {
      fetchChatHistory();
    }
  }, [session]);

  // Add this function to handle selecting a chat from the sidebar
  const selectChat = async (chatId: string) => {
    try {
      if (chatId === currentChatId) return; // Skip if already on this chat
      
      setIsLoading(true);
      setCurrentChatId(chatId);
      
      // Fetch the chat messages
      await fetchChatMessages(chatId);
    } catch (error) {
      console.error('Error selecting chat:', error);
      handleError("Failed to load selected chat");
    } finally {
      setIsLoading(false);
    }
  };

  // Add a function to handle chat renaming
  const renameChat = async (chatId: string, newTitle: string) => {
    try {
      console.log(`Renaming chat ${chatId} to "${newTitle}"`);
      
      const response = await fetch(`/api/chats/${chatId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTitle
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to rename chat: ${errorData.error || response.status}`);
      }
      
      // Update local chat history
      setChatHistory(prev => 
        prev.map(chat => 
          chat._id === chatId 
            ? { ...chat, title: newTitle }
            : chat
        )
      );
      
      // If this is the current chat, update the page title or any other UI elements
      // (optional, depending on your UI requirements)
      
    } catch (error) {
      console.error('Error renaming chat:', error);
      handleError("Failed to rename chat");
    }
  };

  // Add this function to handle chat deletion
  const deleteChat = async (chatId: string) => {
    try {
      console.log(`Deleting chat ${chatId}`);
      
      const response = await fetch(`/api/chats/${chatId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete chat: ${errorData.error || response.status}`);
      }
      
      // If we're deleting the current chat, reset to empty state
      if (chatId === currentChatId) {
        setCurrentChatId(null);
        setMessages([]);
        setCalendarEvents([]);
      }
      
      // Update chat history
      fetchChatHistory();
      
    } catch (error) {
      console.error('Error deleting chat:', error);
      handleError("Failed to delete chat");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black text-xl">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-white text-black">
      {/* Sidebar Component */}
      <ChatSidebar 
        isSidebarExpanded={isSidebarExpanded} 
        setIsSidebarExpanded={setIsSidebarExpanded}
        handleNewChat={handleNewChat}
        isMobile={isMobile}
        chatHistory={chatHistory}
        currentChatId={currentChatId}
        selectChat={selectChat}
        renameChat={renameChat}
        deleteChat={deleteChat}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-200 ${
        isSidebarExpanded && !isMobile ? 'ml-64' : isMobile ? 'ml-0' : 'ml-16'
      }`}>
        {messages.length === 0 ? (
          /* Welcome state with centered content */
          <div className="flex-1 flex flex-col justify-center items-center p-4">
            <div className="max-w-2xl w-full text-center mb-auto"></div> {/* Spacer */}
            
            <div className="flex flex-col items-center max-w-2xl w-full">
              <svg 
                className="w-10 h-10 text-[#C1121F] mb-5 cursor-pointer" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => router.push('/')}
              >
                <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M3 10H21" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="15" r="2" fill="currentColor"/>
              </svg>
              <h2 className="text-3xl mb-8">Hi {session?.user?.name?.split(' ')[0] || 'there'}, how are you?</h2>
              <form onSubmit={handleSendMessage} className="w-full">
                <div className="w-full rounded-lg bg-gray-100 p-2 flex items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="How can I help you today?"
                    className="flex-1 bg-transparent border-0 focus:ring-0 text-black px-3 py-1 outline-none"
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                </div>
              </form>
            </div>
            
            <div className="mb-auto"></div> {/* Bottom spacer for vertical centering */}
          </div>
        ) : (
          /* Conversation state with fixed input box */
          <>
            {/* Scrollable Chat Area */}
            <div className="flex-1 overflow-auto px-4 py-6">
              <div className="space-y-6">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-3/4 ${message.isUser ? 'bg-gray-100' : 'bg-white border border-[#C1121F]'} rounded-lg p-3`}>
                      {message.isUser ? (
                        <div>{message.content}</div>
                      ) : (
                        <div className="flex items-center">
                          <svg 
                            className="w-5 h-5 text-[#C1121F] mr-2 flex-shrink-0" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                            <path d="M3 10H21" stroke="currentColor" strokeWidth="2"/>
                            <path d="M8 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M16 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <circle cx="12" cy="15" r="2" fill="currentColor"/>
                          </svg>
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Fixed Input Area */}
            <div className="border-t border-gray-200 bg-white p-4">
              <form onSubmit={handleSendMessage} className="flex items-center max-w-4xl mx-auto">
                <div className="flex-1 bg-gray-100 rounded-lg p-2 flex items-center">
                  <button 
                    type="button" 
                    className="p-2 text-gray-500 hover:text-gray-700"
                    onClick={handleNewChat}
                    title="New Chat"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="How can I help you today?"
                    className="flex-1 bg-transparent border-0 focus:ring-0 text-black px-3 py-1 outline-none"
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                  <button 
                    type="button" 
                    className="p-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                    onClick={() => router.push('/')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>

            {/* Calendar Events */}
            {calendarEvents.length > 0 && (
              <div className="border-t border-gray-200 pt-4 pb-2 px-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Calendar Events</h3>
                <div className="space-y-2">
                  {calendarEvents.map((event, index) => (
                    <CalendarEventCard key={index} event={event} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {error && (
        <ErrorToast 
          message={error} 
          onClose={() => setError(null)} 
        />
      )}
    </div>
  );
} 