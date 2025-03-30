"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function StickyHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  
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

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileNavOpen]);

  const scrollToSection = (id: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    // Close mobile nav if open
    setMobileNavOpen(false);
    
    // Get the target element's position
    const section = document.getElementById(id);
    if (section) {
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 100;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <motion.div 
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-5 py-2 rounded-full backdrop-blur-sm bg-white/50 transition-all duration-300 ${
          scrolled ? 'border border-[#C1121F]' : 'border border-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3">
          {/* Simple Clock/Calendar SVG - Increased size by 20% */}
          <svg 
            className="w-7 h-7 text-[#C1121F]" 
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
          
          {/* Brand Name - Increased size by 20% */}
          <h1 
            className="text-2xl font-bold text-[#C1121F] boldonse-regular cursor-pointer" 
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
              setMobileNavOpen(false);
            }}
          >timely</h1>
          
          {/* Mobile Navigation Button - Spinning 3 lines to X animation with simplified middle line */}
          <motion.button
            className="md:hidden ml-auto w-10 h-10 flex justify-center items-center z-50"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle mobile menu"
            initial={false}
          >
            <div className="w-7 h-7 flex items-center justify-center relative">
              <motion.span 
                className="block absolute w-full h-0.5 bg-[#C1121F]"
                animate={{
                  rotate: mobileNavOpen ? 45 : 0,
                  y: mobileNavOpen ? 0 : -8
                }}
                transition={{ duration: 0.4 }}
              />
              <motion.span 
                className="block absolute w-full h-0.5 bg-[#C1121F]"
                animate={{
                  opacity: mobileNavOpen ? 0 : 1
                }}
                transition={{ duration: 0.2 }}
              />
              <motion.span 
                className="block absolute w-full h-0.5 bg-[#C1121F]"
                animate={{
                  rotate: mobileNavOpen ? -45 : 0,
                  y: mobileNavOpen ? 0 : 8
                }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </motion.button>
          
          {/* Navigation Options - larger text, Geist Mono font, better vertical alignment */}
          <nav className="hidden md:flex items-center space-x-5 ml-6">
            <a 
              href="#features" 
              className="text-base font-medium text-gray-700 hover:text-[#C1121F] transition-colors duration-200 font-mono"
              onClick={(e) => scrollToSection('features', e)}
            >
              FEATURES
            </a>
            <a href="#" className="text-base font-medium text-gray-700 hover:text-[#C1121F] transition-colors duration-200 font-mono">PRICING</a>
            <a href="#" className="text-base font-medium text-gray-700 hover:text-[#C1121F] transition-colors duration-200 font-mono">BLOG</a>
          </nav>
        </div>
      </motion.div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col items-center space-y-8">
              <motion.a
                href="#features"
                className="text-4xl font-bold text-[#C1121F] font-mono"
                onClick={(e) => scrollToSection('features', e)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                FEATURES
              </motion.a>
              <motion.a
                href="#"
                className="text-4xl font-bold text-[#C1121F] font-mono"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => setMobileNavOpen(false)}
              >
                PRICING
              </motion.a>
              <motion.a
                href="#"
                className="text-4xl font-bold text-[#C1121F] font-mono"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => setMobileNavOpen(false)}
              >
                BLOG
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 