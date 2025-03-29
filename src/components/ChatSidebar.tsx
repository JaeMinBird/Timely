import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ChatHistory } from '@/types/chat';
import ChatList from './sidebar/ChatList';

interface ChatSidebarProps {
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: (expanded: boolean) => void;
  handleNewChat: () => void;
  isMobile: boolean;
  chatHistory?: ChatHistory[];
  currentChatId?: string | null;
  selectChat?: (chatId: string) => void;
  renameChat?: (chatId: string, newTitle: string) => Promise<void>;
  deleteChat?: (chatId: string) => Promise<void>;
}

export default function ChatSidebar({ 
  isSidebarExpanded, 
  setIsSidebarExpanded, 
  handleNewChat,
  isMobile,
  chatHistory = [],
  currentChatId = null,
  selectChat = () => {},
  renameChat,
  deleteChat
}: ChatSidebarProps) {
  const { data: session } = useSession();
  const router = useRouter();
  
  // State for tracking which chat is being renamed
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  
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
  
  // Start editing chat title
  const handleStartEditing = (e: React.MouseEvent, chat: ChatHistory) => {
    e.stopPropagation(); // Prevent selecting the chat
    setEditingChatId(chat._id);
    setEditingTitle(chat.title);
  };
  
  // Save the edited chat title
  const handleSaveTitle = async (chatId: string) => {
    if (editingTitle.trim() === "") return; // Don't save empty titles
    
    if (renameChat) {
      await renameChat(chatId, editingTitle.trim());
    }
    
    // Reset editing state
    setEditingChatId(null);
    setEditingTitle("");
  };
  
  // Handle direct deletion without confirmation
  const handleDeleteClick = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation(); // Prevent selecting the chat
    if (deleteChat) {
      deleteChat(chatId);
    }
  };

  // Handle key press when editing (Enter to save, Escape to cancel)
  const handleEditKeyDown = (e: React.KeyboardEvent, chatId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveTitle(chatId);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditingChatId(null);
      setEditingTitle("");
    }
  };

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
              
              {/* Chat List Component */}
              <div className={`flex-1 ${isSidebarExpanded ? 'overflow-y-auto' : 'overflow-hidden'}`}>
                <ChatList
                  isSidebarExpanded={isSidebarExpanded}
                  chatHistory={chatHistory}
                  currentChatId={currentChatId}
                  editingChatId={editingChatId}
                  editingTitle={editingTitle}
                  selectChat={selectChat}
                  setEditingChatId={setEditingChatId}
                  setEditingTitle={setEditingTitle}
                  handleStartEditing={handleStartEditing}
                  handleSaveTitle={handleSaveTitle}
                  handleEditKeyDown={handleEditKeyDown}
                  handleDeleteClick={handleDeleteClick}
                  renameChat={renameChat}
                  deleteChat={deleteChat}
                />
              </div>
              
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