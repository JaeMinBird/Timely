"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function StickyHeader() {
  const [scrolled, setScrolled] = useState(false);
  
  // Check if page is scrolled to control header appearance
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div 
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-5 py-2 rounded-full backdrop-blur-sm bg-white/50 transition-all duration-300 ${
        scrolled ? 'border border-[#C1121F]' : 'border border-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-3">
        {/* Simple Clock/Calendar SVG */}
        <svg 
          className="w-6 h-6 text-[#C1121F]" 
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
        
        {/* Brand Name */}
        <h1 className="text-xl font-bold text-[#C1121F] boldonse-regular">timely</h1>
        
        {/* Navigation Options - larger text, Geist Mono font, better vertical alignment */}
        <nav className="hidden md:flex items-center space-x-5 ml-6">
          <a href="#" className="text-base font-medium text-gray-700 hover:text-[#C1121F] transition-colors duration-200 font-mono">PRICING</a>
          <a href="#" className="text-base font-medium text-gray-700 hover:text-[#C1121F] transition-colors duration-200 font-mono">FEATURES</a>
          <a href="#" className="text-base font-medium text-gray-700 hover:text-[#C1121F] transition-colors duration-200 font-mono">BLOG</a>
        </nav>
      </div>
    </motion.div>
  );
} 