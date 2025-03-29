"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ChatSidebar from "@/components/ChatSidebar";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
}

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
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

  // Keep focus on input after messages change
  useEffect(() => {
    // Small delay to ensure the DOM has updated
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  }, [messages.length]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "null",
        isUser: false,
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
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
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-200 ${
        isSidebarExpanded ? 'ml-64' : 'ml-16'
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
              <h2 className="text-3xl mb-8">Hi {session?.user?.name?.split(' ')[0] || 'Jae'}, how are you?</h2>
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
                  <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
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
          </>
        )}
      </div>
    </div>
  );
} 