"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import { ChatHistory } from '@/types/chat';
import CalendarEventCard from '@/components/CalendarEventCard';
import ErrorToast from '@/components/ErrorToast';
import { ICalendarEvent } from '@/models/Chat';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
}

// Dynamically import the ChatSidebar with no SSR to avoid hydration issues with animations
const ChatSidebar = dynamic(() => import('@/components/ChatSidebar'), { ssr: false });

// Add this at the top, after your imports
const LOCAL_STORAGE_KEY = 'local_chat_data';

// Add this function to load chat data from localStorage
const loadLocalChatData = () => {
  if (typeof window === 'undefined') return { chats: [], messages: [] };
  
  try {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (e) {
    console.error('Error loading local chat data:', e);
  }
  
  return { chats: [], messages: {} };
};

// Add this function to save chat data to localStorage
const saveLocalChatData = (chats: ChatHistory[], messages: Record<string, Message[]>) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ chats, messages }));
  } catch (e) {
    console.error('Error saving local chat data:', e);
  }
};

// Update the sendMessageToOpenAI function to include history and model provider
const sendMessageToOpenAI = async (message: string, history: any[] = [], modelProvider: 'openai' | 'gemini' = 'openai'): Promise<{ message: string, history: any[] }> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, history, modelProvider }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get response from AI');
    }
    
    const data = await response.json();
    return { message: data.message, history: data.history };
  } catch (error) {
    console.error('Error sending message to OpenAI:', error);
    throw error;
  }
};

// Function to save chat to MongoDB
const saveChatToMongoDB = async (chatId: string, chatTitle: string, messages: Message[]) => {
  try {
    // Convert our Message format to the format expected by the API
    const formattedMessages = messages.map(msg => ({
      role: msg.isUser ? 'user' : 'assistant',
      content: msg.content,
      timestamp: new Date().toISOString()
    }));
    
    const response = await fetch('/api/chat', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId,
        title: chatTitle,
        messages: formattedMessages
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save chat to database');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving chat to MongoDB:', error);
    throw error;
  }
};

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
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>({});
  const [modelProvider, setModelProvider] = useState<'openai' | 'gemini'>('openai');
  
  // Add new error handling function
  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => {
      setError(null);
    }, 5000);
  };
  
  // Move the exportChatToCalendar function here, inside the component
  const exportChatToCalendar = async () => {
    if (!currentChatId || messages.length === 0) {
      handleError("No chat content to export to calendar");
      return;
    }

    try {
      setIsLoading(true);
      
      // Get all messages from the current chat
      const chatMessages = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content
      }));
      
      // Send to calendar API
      const response = await fetch('/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chatMessages),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to export to calendar');
      }
      
      // Success message
      handleError("Successfully exported to Google Calendar!");
    } catch (error) {
      console.error('Error exporting to calendar:', error);
      handleError(error instanceof Error ? error.message : "Failed to export to calendar");
    } finally {
      setIsLoading(false);
    }
  };
  
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

  // Load chat data from localStorage on initial load
  useEffect(() => {
    if (typeof window !== 'undefined' && session?.user) {
      const { chats, messages } = loadLocalChatData();
      setChatHistory(chats || []);
      setAllMessages(messages || {});
    }
  }, [session]);
  
  // Save chat data to localStorage whenever it changes
  useEffect(() => {
    if (chatHistory.length > 0 || Object.keys(allMessages).length > 0) {
      saveLocalChatData(chatHistory, allMessages);
    }
  }, [chatHistory, allMessages]);

  // Load chat data from server on initial load
  useEffect(() => {
    if (session?.user) {
      fetchChatHistoryFromServer();
    }
  }, [session]);
  
  // Save chat data to localStorage whenever it changes
  useEffect(() => {
    if (chatHistory.length > 0 || Object.keys(allMessages).length > 0) {
      saveLocalChatData(chatHistory, allMessages);
    }
  }, [chatHistory, allMessages]);

  // Replace fetchChatHistory with server version
  const fetchChatHistoryFromServer = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/chat');
      
      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }
      
      const data = await response.json();
      
      // Convert API response format to our app format
      const formattedChats: ChatHistory[] = data.chats.map((chat: any) => ({
        _id: chat._id,
        title: chat.title,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt
      }));
      
      // Convert messages to our app format
      const formattedMessages: Record<string, Message[]> = {};
      data.chats.forEach((chat: any) => {
        formattedMessages[chat._id] = chat.messages.map((msg: any, index: number) => ({
          id: `server-msg-${index}`,
          content: msg.content,
          isUser: msg.role === 'user'
        }));
      });
      
      setChatHistory(formattedChats);
      setAllMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      handleError("Failed to load chat history");
      
      // Fall back to local storage if server fetch fails
      const { chats, messages } = loadLocalChatData();
      setChatHistory(chats || []);
      setAllMessages(messages || {});
    } finally {
      setIsLoading(false);
    }
  };

  // Select chat function
  const selectChat = (chatId: string) => {
    // Set current chat ID
    setCurrentChatId(chatId);
    
    // Load messages for this chat
    const chatMessages = allMessages[chatId] || [];
    setMessages(chatMessages);
    
    // Reset calendar events (you would load them from the server if needed)
    setCalendarEvents([]);
    
    // Focus the input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  };
  
  // Replace handleNewChat with server version
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
      
      // Create a new chat on the server
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: 'New Chat' }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create new chat');
      }
      
      const newChat = await response.json();
      
      // Add to local chat history
      const formattedChat: ChatHistory = {
        _id: newChat._id,
        title: newChat.title,
        createdAt: newChat.createdAt,
        updatedAt: newChat.updatedAt
      };
      
      // Update chat history
      setChatHistory(prev => [formattedChat, ...prev]);
      
      // Initialize empty messages for this chat
      setAllMessages(prev => ({
        ...prev,
        [formattedChat._id]: []
      }));
      
      // Set as current chat
      setCurrentChatId(formattedChat._id);
      setMessages([]);
      setCalendarEvents([]);
      
      // Focus on input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    } catch (error) {
      console.error('Error creating new chat:', error);
      handleError("Failed to create a new chat");
      
      // Fallback to local version if server fails
      const newChatId = `local-${Date.now()}`;
      
      // Create a new chat in history
      const newChat = {
        _id: newChatId,
        title: 'New Chat',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Update chat history
      setChatHistory(prev => [newChat, ...prev]);
      
      // Initialize empty messages for this chat
      setAllMessages(prev => ({
        ...prev,
        [newChatId]: []
      }));
      
      // Set as current chat
      setCurrentChatId(newChatId);
      setMessages([]);
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

  // Replace handleSendMessage with this updated version
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    // Generate a chat ID if we don't have one yet
    if (!currentChatId) {
      handleNewChat();
      return;
    }

    // Set loading state
    setIsLoading(true);

    try {
      // Create user message
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        content: inputValue,
        isUser: true,
      };
      
      // Update local messages state
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      
      // Update all messages
      setAllMessages(prev => ({
        ...prev,
        [currentChatId]: updatedMessages
      }));
      
      // Clear input
      setInputValue("");
      
      // If this is the first message, update the chat title
      const currentChatData = chatHistory.find(chat => chat._id === currentChatId);
      let chatTitle = currentChatData?.title || 'New Chat';
      
      if (messages.length === 0) {
        chatTitle = inputValue.length > 30 
          ? `${inputValue.substring(0, 30)}...` 
          : inputValue;
        
        setChatHistory(prev => 
          prev.map(chat => 
            chat._id === currentChatId 
              ? { ...chat, title: chatTitle, updatedAt: new Date().toISOString() }
              : chat
          )
        );
      }
      
      // Convert our messages to the CoreMessage format for the API
      const apiMessages = updatedMessages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content
      }));
      
      // Send to OpenAI API with history and model provider
      const aiResult = await sendMessageToOpenAI(inputValue, apiMessages, modelProvider);
      
      // Create AI message
      const aiMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        content: aiResult.message,
        isUser: false,
      };
      
      const updatedWithAiMessages = [...updatedMessages, aiMessage];
      setMessages(updatedWithAiMessages);
      
      // Update all messages
      setAllMessages(prev => ({
        ...prev,
        [currentChatId as string]: updatedWithAiMessages
      }));
      
      // Save to MongoDB - convert to the format expected by the API
      const formattedMessages = updatedWithAiMessages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content,
        timestamp: new Date().toISOString()
      }));
      
      await saveChatToMongoDB(
        currentChatId, 
        chatTitle, 
        updatedWithAiMessages
      );
    } catch (error) {
      console.error('Error in message flow:', error);
      handleError("Failed to send message or get response");
    } finally {
      setIsLoading(false);
    }
  };

  // Replace renameChat with server version
  const renameChat = async (chatId: string, newTitle: string) => {
    try {
      setIsLoading(true);
      
      // Update chat title on the server
      const response = await fetch(`/api/chat?chatId=${chatId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to rename chat');
      }
      
      // Update chat history locally
      setChatHistory(prev => 
        prev.map(chat => 
          chat._id === chatId 
            ? { ...chat, title: newTitle, updatedAt: new Date().toISOString() }
            : chat
        )
      );
    } catch (error) {
      console.error('Error renaming chat:', error);
      handleError("Failed to rename chat");
    } finally {
      setIsLoading(false);
    }
  };

  // Replace deleteChat with server version
  const deleteChat = async (chatId: string) => {
    try {
      setIsLoading(true);
      
      // Delete chat on the server
      const response = await fetch(`/api/chat?chatId=${chatId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete chat');
      }
      
      // Remove chat from history locally
      setChatHistory(prev => prev.filter(chat => chat._id !== chatId));
      
      // Remove messages for this chat
      setAllMessages(prev => {
        const updated = { ...prev };
        delete updated[chatId];
        return updated;
      });
      
      // If we're deleting the current chat, reset to empty state
      if (chatId === currentChatId) {
        setCurrentChatId(null);
        setMessages([]);
        setCalendarEvents([]);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      handleError("Failed to delete chat");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle model function
  const toggleModel = () => {
    setModelProvider(prev => prev === 'openai' ? 'gemini' : 'openai');
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
              <div className="w-full rounded-lg bg-gray-100 p-2 flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="How can I help you today?"
                  className="flex-1 bg-transparent border-0 focus:ring-0 text-black px-3 py-1 outline-none"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
              </div>
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
                          <div>{message.content}</div>
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
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                  <button 
                    type="button" 
                    className={`p-2 ${modelProvider === 'openai' ? 'text-blue-500' : 'text-green-500'} hover:opacity-80 cursor-pointer`}
                    onClick={toggleModel}
                    title={`Current: ${modelProvider === 'openai' ? 'OpenAI' : 'Gemini'} (click to switch)`}
                  >
                    {modelProvider === 'openai' ? 'GPT' : 'GEM'}
                  </button>
                  <button 
                    type="button" 
                    className="p-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                    onClick={() => router.push('/')}
                    title="Home"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                  </button>
                  <button 
                    type="button" 
                    className="p-2 text-[#C1121F] hover:text-red-800 cursor-pointer"
                    onClick={exportChatToCalendar}
                    title="Export to Calendar"
                    disabled={isLoading || messages.length === 0}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M3 10H21" stroke="currentColor" strokeWidth="2"/>
                      <path d="M8 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M16 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="15" r="2" fill="currentColor"/>
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