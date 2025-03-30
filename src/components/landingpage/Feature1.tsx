"use client";
import { motion, useTransform } from "framer-motion";

interface ContentSectionProps {
  scrollY: any;
}

export default function ContentSection({ scrollY }: ContentSectionProps) {
  // Animation values for this component
  const redSectionScale = useTransform(scrollY, [150, 400], [0.8, 1]);
  const redSectionOpacity = useTransform(scrollY, [150, 350], [0, 1]);

  return (
    <section className="min-h-screen relative mt-[-25vh]">
      <div className="container mx-auto px-8">
        <div className="h-16"></div> {/* Reduced spacer */}
        <div className="w-full max-w-md mx-auto md:w-[80%] md:max-w-none">
          <motion.div 
            className="relative z-10 w-full"
            style={{ 
              scale: redSectionScale,
              opacity: redSectionOpacity
            }}
          >
            <motion.div 
              className="p-8 md:p-16 w-full"
              initial={{ borderRadius: 30 }}
              whileInView={{ borderRadius: 16 }}
              transition={{ duration: 1 }}
            >
              {/* Updated content to look like a chat */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col md:flex-row gap-8"
              >
                <div className="md:w-1/2">
                  <div className="text-center mb-6">
                    <h3 className="text-4xl font-bold text-black mb-2">Natural Language<br /><span className="text-[#C1121F] font-extrabold">Planning</span></h3>
                  </div>
                  
                  <div className="space-y-6">
                    {/* User message */}
                    <div className="flex justify-end">
                      <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                        <p className="text-black">"lunch with alex at 1"</p>
                      </div>
                    </div>
                    
                    {/* Assistant response */}
                    <div className="flex justify-start">
                      <div className="bg-white border border-[#C1121F] rounded-lg p-3 max-w-xs">
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
                          <p className="text-black">Added to your weekly calendar</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Instruction text */}
                    <p className="text-black/70 text-center mt-4">
                      Done. No clicks, just conversation.
                    </p>
                  </div>
                </div>
                
                <div className="md:w-1/2 bg-black/30 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  {/* Demo placeholder */}
                  <div className="text-white p-8 text-center">
                    <div className="flex flex-col items-center justify-center py-12">
                      <p className="font-['Geist_Mono'] text-white/80">demo</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Repositioned decorative elements in the second section */}
      <motion.div 
        className="absolute right-[15%] top-[130%] hidden md:block"
        style={{ y: useTransform(scrollY, [300, 1000], [0, -80]) }}
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 3, repeat: Infinity }
        }}
      >
        <div className="text-[#C1121F] text-4xl">O</div>
      </motion.div>
      
      <motion.div 
        className="absolute left-[10%] top-[150%] hidden md:block"
        style={{ y: useTransform(scrollY, [300, 1000], [0, 60]) }}
        whileHover={{ rotate: 45 }}
      >
        <div className="w-12 h-12 border border-[#C1121F]"></div>
      </motion.div>
      
      <motion.div 
        className="absolute right-[10%] top-[160%] hidden md:block"
        style={{ y: useTransform(scrollY, [300, 1000], [0, -40]) }}
        animate={{ rotate: [0, 180, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      >
        <div className="text-[#C1121F] text-4xl">×</div>
      </motion.div>
      
      <motion.div 
        className="absolute left-[15%] top-[175%] hidden md:block"
        style={{ y: useTransform(scrollY, [300, 1000], [0, -30]) }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-4 h-4 bg-black"></div>
      </motion.div>
      
      <motion.div 
        className="absolute right-[25%] top-[140%] hidden md:block"
        style={{ y: useTransform(scrollY, [300, 1000], [0, 35]) }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <div className="w-6 h-6 rounded-full border border-[#C1121F]"></div>
      </motion.div>
    </section>
  );
} 