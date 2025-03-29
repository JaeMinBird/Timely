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
              className="bg-[#C1121F] p-8 md:p-16 w-full rounded-xl"
              initial={{ borderRadius: 30 }}
              whileInView={{ borderRadius: 16 }}
              transition={{ duration: 1 }}
            >
              {/* Content for red section */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col md:flex-row gap-8"
              >
                <div className="md:w-1/2">
                  <h3 className="text-3xl font-bold text-white mb-4">Customer Call Transcripts</h3>
                  <p className="text-white/90 mb-6">Analyze customer feedback and extract insights from call transcripts.</p>
                  <div className="bg-black/30 p-6 rounded-lg mt-4 text-white overflow-auto backdrop-blur-sm">
                    <h4 className="text-xl font-medium text-white mb-5">Conversation Intelligence</h4>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                        <p className="font-light">Sentiment analysis with 92% accuracy</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                        <p className="font-light">Automated topic categorization</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                        <p className="font-light">Key insights extracted and prioritized</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-white/20">
                      <p className="text-sm font-light text-white/80">
                        "The simplicity and accuracy changed how we understand our customers."
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/2 bg-black/30 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  {/* Placeholder for demo gif */}
                  <div className="text-white p-8 text-center">
                    <div className="flex flex-col items-center justify-center py-12">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white/60 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <circle cx="12" cy="12" r="10" />
                        <path d="M10 8l6 4-6 4V8z" />
                      </svg>
                      <p className="font-light text-white/80">Interactive demo</p>
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
        className="absolute right-[15%] top-[130%]"
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
        className="absolute left-[10%] top-[150%]"
        style={{ y: useTransform(scrollY, [300, 1000], [0, 60]) }}
        whileHover={{ rotate: 45 }}
      >
        <div className="w-12 h-12 border border-[#C1121F]"></div>
      </motion.div>
      
      <motion.div 
        className="absolute right-[10%] top-[160%]"
        style={{ y: useTransform(scrollY, [300, 1000], [0, -40]) }}
        animate={{ rotate: [0, 180, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      >
        <div className="text-[#C1121F] text-4xl">×</div>
      </motion.div>
      
      <motion.div 
        className="absolute left-[15%] top-[175%]"
        style={{ y: useTransform(scrollY, [300, 1000], [0, -30]) }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-4 h-4 bg-black"></div>
      </motion.div>
      
      <motion.div 
        className="absolute right-[25%] top-[140%]"
        style={{ y: useTransform(scrollY, [300, 1000], [0, 35]) }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <div className="w-6 h-6 rounded-full border border-[#C1121F]"></div>
      </motion.div>
    </section>
  );
} 