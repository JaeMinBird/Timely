import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ErrorToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function ErrorToast({ 
  message, 
  onClose, 
  duration = 5000 
}: ErrorToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md shadow-md flex items-center z-50"
          role="alert"
        >
          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="block sm:inline">{message}</span>
          <button 
            className="ml-4 text-red-700"
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 