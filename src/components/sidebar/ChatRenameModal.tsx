import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ChatRenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (newTitle: string) => void;
  currentTitle: string;
}

export default function ChatRenameModal({ 
  isOpen, 
  onClose, 
  onRename, 
  currentTitle 
}: ChatRenameModalProps) {
  const [title, setTitle] = useState(currentTitle);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus the input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [isOpen]);
  
  // Reset title when currentTitle changes
  useEffect(() => {
    setTitle(currentTitle);
  }, [currentTitle]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onRename(title.trim());
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">Rename Chat</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter chat title"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 