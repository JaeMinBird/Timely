import { useRef } from "react";
import { ChatHistory } from '@/types/chat';

interface ChatListProps {
  isSidebarExpanded: boolean;
  chatHistory: ChatHistory[];
  currentChatId: string | null;
  editingChatId: string | null;
  editingTitle: string;
  selectChat: (chatId: string) => void;
  setEditingChatId: (chatId: string | null) => void;
  setEditingTitle: (title: string) => void;
  handleStartEditing: (e: React.MouseEvent, chat: ChatHistory) => void;
  handleSaveTitle: (chatId: string) => void;
  handleEditKeyDown: (e: React.KeyboardEvent, chatId: string) => void;
  handleDeleteClick: (e: React.MouseEvent, chatId: string) => void;
  renameChat?: (chatId: string, newTitle: string) => void;
  deleteChat?: (chatId: string) => void;
}

export default function ChatList({
  isSidebarExpanded,
  chatHistory,
  currentChatId,
  editingChatId,
  editingTitle,
  selectChat,
  setEditingChatId,
  setEditingTitle,
  handleStartEditing,
  handleSaveTitle,
  handleEditKeyDown,
  handleDeleteClick,
  renameChat,
  deleteChat
}: ChatListProps) {
  const editInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {/* Chats section header */}
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
      
      {/* Chat list area */}
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
                className={`group p-2 rounded-md cursor-pointer hover:bg-gray-100 relative ${
                  editingChatId === chat._id ? 'bg-gray-100' : ''
                }`}
                onClick={() => editingChatId !== chat._id && selectChat(chat._id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center truncate w-full">
                    {editingChatId === chat._id ? (
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => handleEditKeyDown(e, chat._id)}
                        onBlur={() => handleSaveTitle(chat._id)}
                        className="text-sm font-medium w-full bg-transparent border-b-2 border-[#C1121F] focus:outline-none px-1 py-0.5"
                        autoFocus
                      />
                    ) : (
                      <span 
                        className={`text-sm font-medium truncate ${currentChatId === chat._id ? 'text-[#C1121F]' : 'text-gray-700'}`}
                        onDoubleClick={(e) => handleStartEditing(e, chat)}
                      >
                        {chat.title}
                      </span>
                    )}
                  </div>
                  
                  {/* Action buttons - only show on hover and not while editing */}
                  {editingChatId !== chat._id && (
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {/* Rename button */}
                      {renameChat && (
                        <button 
                          onClick={(e) => handleStartEditing(e, chat)}
                          className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                          title="Rename chat"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      )}
                      
                      {/* Delete button */}
                      {deleteChat && (
                        <button 
                          onClick={(e) => handleDeleteClick(e, chat._id)}
                          className="p-1 text-gray-400 hover:text-red-600 focus:outline-none"
                          title="Delete chat"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(chat.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
} 