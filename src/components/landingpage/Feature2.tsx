"use client";
import { motion, useTransform, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface PlanWithEaseProps {
  scrollY: any;
}

export default function PlanWithEase({ scrollY }: PlanWithEaseProps) {
  // Animation values for this component
  const sectionScale = useTransform(scrollY, [500, 750], [0.8, 1]);
  const sectionOpacity = useTransform(scrollY, [500, 700], [0, 1]);
  
  // State for tracking which option is selected - now defaulting to option 1
  const [selectedOption, setSelectedOption] = useState<number>(1);
  const [demoContent, setDemoContent] = useState<string>("Create Meetings Demo");
  // Add state for video source
  const [videoSrc, setVideoSrc] = useState<string>("/videos/ex2.webm");

  // Function to handle option selection
  const handleOptionSelect = (optionId: number) => {
    // If the same option is clicked again, don't change anything
    if (selectedOption === optionId) return;
    
    // Set the new selection
    setSelectedOption(optionId);
    
    // Update demo content and video source based on selection
    switch(optionId) {
      case 1:
        setDemoContent("Create Meetings Demo");
        setVideoSrc("/videos/ex2.webm");
        break;
      case 2:
        setDemoContent("Focus Time Demo");
        setVideoSrc("/videos/ex3.webm");
        break;
      case 3:
        setDemoContent("Calendar Sync Demo");
        setVideoSrc("/videos/ex4.webm");
        break;
    }
  };

  return (
    <section className="min-h-screen relative mt-[-25vh]">
      <div className="container mx-auto px-8">
        <div className="h-8"></div> {/* Reduced spacer from h-16 to h-8 */}
        <div className="w-full max-w-md mx-auto md:w-[80%] md:max-w-none">
          <motion.div 
            className="relative z-10 w-full"
            style={{ 
              scale: sectionScale,
              opacity: sectionOpacity
            }}
          >
            <motion.div 
              className="p-8 md:p-16 w-full"
              initial={{ borderRadius: 30 }}
              whileInView={{ borderRadius: 16 }}
              transition={{ duration: 1 }}
            >
              {/* Content for Plan with Ease */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col md:flex-row gap-8"
              >
                {/* Commands section - MOBILE: stack on top, DESKTOP: right side now */}
                <div className="md:w-1/2 order-1 md:order-2">
                  <div className="text-center md:text-center mb-4">
                    <h3 className="text-4xl font-bold text-black mb-1">Plan with <span className="text-[#C1121F] font-extrabold">Ease</span></h3>
                  </div>
                  
                  {/* Command lines with animations */}
                  <div className="flex flex-col space-y-1">
                    {/* Command 1 */}
                    <div className="relative">
                      <div 
                        className="flex items-center py-2 cursor-pointer hover:text-[#C1121F]"
                        onClick={() => handleOptionSelect(1)}
                      >
                        <svg className={`w-4 h-4 mr-2 flex-shrink-0 ${selectedOption === 1 ? 'text-[#C1121F]' : 'text-black'}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                          <path d="M3 10H21" stroke="currentColor" strokeWidth="2"/>
                          <path d="M8 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M16 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span className={`font-medium text-base ${selectedOption === 1 ? 'text-[#C1121F]' : ''}`}>
                          Create Meetings
                        </span>
                      </div>
                      
                      {/* Line under section 1 */}
                      <motion.div 
                        className="h-[1px] bg-[#C1121F]/30 w-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: selectedOption === 1 ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                      ></motion.div>
                      
                      {/* Container for quote with animation */}
                      <div className="relative overflow-hidden">
                        {/* Quote */}
                        <motion.div 
                          className="overflow-hidden"
                          initial={{ height: 0 }}
                          animate={{ height: selectedOption === 1 ? 'auto' : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="text-gray-600 italic pl-6 pr-2 py-2 text-sm">
                            "Schedule a team check-in next Tuesday."
                          </p>
                        </motion.div>
                      </div>
                    </div>
                    
                    {/* Command 2 */}
                    <div className="relative">
                      <div 
                        className="flex items-center py-2 cursor-pointer hover:text-[#C1121F]"
                        onClick={() => handleOptionSelect(2)}
                      >
                        <svg className={`w-4 h-4 mr-2 flex-shrink-0 ${selectedOption === 2 ? 'text-[#C1121F]' : 'text-black'}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                          <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span className={`font-medium text-base ${selectedOption === 2 ? 'text-[#C1121F]' : ''}`}>
                          Block Focus Time
                        </span>
                      </div>
                      
                      {/* Line under section 2 */}
                      <motion.div 
                        className="h-[1px] bg-[#C1121F]/30 w-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: selectedOption === 2 ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                      ></motion.div>
                      
                      {/* Container for quote with animation */}
                      <div className="relative overflow-hidden">
                        {/* Quote */}
                        <motion.div 
                          className="overflow-hidden"
                          initial={{ height: 0 }}
                          animate={{ height: selectedOption === 2 ? 'auto' : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="text-gray-600 italic pl-6 pr-2 py-2 text-sm">
                            "Block two hours for deep work tomorrow."
                          </p>
                        </motion.div>
                      </div>
                    </div>
                    
                    {/* Command 3 */}
                    <div className="relative">
                      <div 
                        className="flex items-center py-2 cursor-pointer hover:text-[#C1121F]"
                        onClick={() => handleOptionSelect(3)}
                      >
                        <svg className={`w-4 h-4 mr-2 flex-shrink-0 ${selectedOption === 3 ? 'text-[#C1121F]' : 'text-black'}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M16 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M3 9H21" stroke="currentColor" strokeWidth="2"/>
                          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                          <path d="M16 14L8 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M12 10V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span className={`font-medium text-base ${selectedOption === 3 ? 'text-[#C1121F]' : ''}`}>
                          Sync Calendars
                        </span>
                      </div>
                      
                      {/* Line under section 3 */}
                      <motion.div 
                        className="h-[1px] bg-[#C1121F]/30 w-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: selectedOption === 3 ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                      ></motion.div>
                      
                      {/* Container for quote with animation */}
                      <div className="relative overflow-hidden">
                        {/* Quote */}
                        <motion.div 
                          className="overflow-hidden"
                          initial={{ height: 0 }}
                          animate={{ height: selectedOption === 3 ? 'auto' : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="text-gray-600 italic pl-6 pr-2 py-2 text-sm">
                            "Share my availability with the client team."
                          </p>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Add the tagline directly following the commands, matching Feature1 style */}
                  <p className="text-black/70 text-center mt-4">
                    Create, block, and sync—just by asking.
                  </p>
                </div>
                
                {/* Demo section - second on mobile, first on desktop (appears on left on desktop) */}
                <div className="md:w-1/2 order-2 md:order-1">
                  <div className="bg-black/30 rounded-lg overflow-hidden relative">
                    {/* Video container with fixed aspect ratio - taller on desktop */}
                    <div className="relative w-full h-0 pb-[56.25%] md:pb-[65%]">
                      {/* Permanent background to prevent gray showing through */}
                      <div className="absolute inset-0 bg-black/40"></div>
                      
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={videoSrc}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="absolute inset-0 w-full h-full z-10"
                        >
                          <video 
                            className="absolute inset-0 w-full h-full object-cover"
                            autoPlay
                            muted
                            loop
                            playsInline
                          >
                            <source src={videoSrc} type="video/webm" />
                            Your browser does not support the video tag.
                          </video>
                        </motion.div>
                      </AnimatePresence>
                      
                      {/* Flash effect - white overlay that fades in/out */}
                      <AnimatePresence>
                        <motion.div
                          key={`flash-${videoSrc}`}
                          initial={{ opacity: 0.7 }}
                          animate={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="absolute inset-0 bg-white/70 pointer-events-none z-20"
                        />
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <motion.div 
        className="absolute right-[18%] top-[110%] hidden md:block"
        style={{ y: useTransform(scrollY, [600, 1200], [0, -60]) }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <div className="text-[#C1121F] text-4xl">⦿</div>
      </motion.div>
      
      <motion.div 
        className="absolute left-[12%] top-[130%] hidden md:block"
        style={{ y: useTransform(scrollY, [600, 1200], [0, 40]) }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <div className="w-8 h-8 border-2 border-[#C1121F] rounded-md"></div>
      </motion.div>
      
      <motion.div 
        className="absolute right-[12%] top-[150%] hidden md:block"
        style={{ y: useTransform(scrollY, [600, 1200], [0, -50]) }}
        animate={{ rotate: [0, 45, 0, -45, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <div className="text-[#C1121F] text-3xl">+</div>
      </motion.div>
    </section>
  );
} 