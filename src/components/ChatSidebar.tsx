import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChatHistory } from '@/types/chat';

interface ChatSidebarProps {
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: (expanded: boolean) => void;
  handleNewChat: () => void;
  isMobile: boolean;
  chatHistory?: ChatHistory[];
  currentChatId?: string | null;
  selectChat?: (chatId: string) => void;
}

export default function ChatSidebar({ 
  isSidebarExpanded, 
  setIsSidebarExpanded, 
  handleNewChat,
  isMobile,
  chatHistory = [],
  currentChatId = null,
  selectChat = () => {}
}: ChatSidebarProps) {
  const { data: session } = useSession();
  const router = useRouter();
  
  // Common avatar element to avoid duplication
  const userAvatar = (
    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white font-medium">
      {session?.user?.name?.charAt(0) || 'J'}
    </div>
  );

  // Mobile sidebar toggle button
  if (isMobile && !isSidebarExpanded) {
    return (
      <button 
        className="fixed top-4 left-4 z-50 bg-transparent p-2 flex items-center justify-center"
        onClick={() => setIsSidebarExpanded(true)}
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </button>
    );
  }

  return (
    <AnimatePresence>
      {(!isMobile || isSidebarExpanded) && (
        <div className={`${isMobile ? 'fixed inset-0 z-40' : 'fixed inset-y-0 left-0 z-30'} ${
          isMobile && isSidebarExpanded ? 'flex' : isMobile ? 'hidden' : 'flex'
        }`}>
          {/* Blurred backdrop behind sidebar on mobile */}
          {isMobile && isSidebarExpanded && (
            <motion.div 
              className="absolute inset-0 backdrop-blur-sm bg-white/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsSidebarExpanded(false)}
            ></motion.div>
          )}
          
          <motion.div 
            className={`${isMobile ? 'w-64 relative z-10' : 
              isSidebarExpanded ? 'w-64' : 'w-16'} bg-white border-r border-gray-200
              overflow-hidden h-full shadow-lg`}
            initial={isMobile ? { x: "-100%" } : {}}
            animate={isMobile ? { x: 0 } : {}}
            exit={isMobile ? { x: "-100%" } : {}}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="flex flex-col h-full py-4 relative">
              {/* Top section with toggle button in consistent position */}
              <div className="h-10 mb-6 relative">
                {/* Toggle button with fixed position */}
                <button 
                  className="absolute left-3 p-2 rounded-md hover:bg-gray-100 w-10 h-10 flex items-center justify-center"
                  onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                >
                  {isSidebarExpanded ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                  )}
                </button>
                
                {/* Logo and text only appear in expanded state */}
                {isSidebarExpanded && (
                  <div 
                    className="absolute left-16 flex items-center h-10 cursor-pointer"
                    onClick={() => router.push('/')}
                  >
                    <svg className="w-6 h-6 text-[#C1121F]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M3 10H21" stroke="currentColor" strokeWidth="2"/>
                      <path d="M8 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M16 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="15" r="2" fill="currentColor"/>
                    </svg>
                    <h1 className="text-xl font-bold ml-2">timely</h1>
                  </div>
                )}
              </div>
              
              {/* New chat button with absolute positioning for icon */}
              <div className="h-10 mb-6 relative mx-3">
                <button 
                  className="w-full h-10 rounded-md hover:bg-red-50 flex items-center"
                  onClick={handleNewChat}
                >
                  <div className="absolute left-1 w-8 h-8 flex items-center justify-center text-[#C1121F]">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  
                  <span className={`absolute left-12 flex items-center h-10 text-[#C1121F] font-medium whitespace-nowrap 
                    transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    New Chat
                  </span>
                </button>
              </div>
              
              {/* Chats section with matching alignment */}
              <div className="border-t border-gray-200 pt-4 mb-2 relative">
                <div className="h-10 mx-3 hover:bg-gray-100 rounded-md relative">
                  <div className="absolute left-1 w-8 h-10 flex items-center justify-center text-gray-600">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  
                  <span className={`absolute left-12 flex items-center h-10 text-sm font-medium whitespace-nowrap 
                    transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    Chats
                  </span>
                </div>
              </div>
              
              {/* Chat history area - now populated with actual chats */}
              <div className={`flex-1 px-4 overflow-auto transition-all duration-300 ease-in-out 
                ${isSidebarExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none hidden'}`}>
                {chatHistory.length === 0 ? (
                  <div className="text-gray-500 text-sm text-center py-4">
                    No chats yet. Start a new chat!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {chatHistory.map((chat) => (
                      <div 
                        key={chat._id}
                        className={`p-2 rounded-md cursor-pointer truncate hover:bg-gray-100 ${
                          currentChatId === chat._id ? 'bg-gray-100' : ''
                        }`}
                        onClick={() => selectChat(chat._id)}
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          <span className="text-sm font-medium truncate">{chat.title}</span>
                        </div>
                        <div className="text-xs text-gray-500 ml-6">
                          {new Date(chat.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Flex spacer */}
              <div className="flex-1"></div>
              
              {/* User profile */}
              <div className="border-t border-gray-200 pt-5 pb-2 relative">
                <div className="h-10 mx-3 hover:bg-gray-100 rounded-md relative">
                  <div className="absolute left-1 w-8 h-10 flex items-center justify-center text-white font-medium flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                      {session?.user?.name?.charAt(0) || 'J'}
                    </div>
                  </div>
                  
                  <div className={`absolute left-12 flex items-center h-10 font-medium truncate max-w-[150px] 
                    transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    {session?.user?.name || 'JaeMin Bird'}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 