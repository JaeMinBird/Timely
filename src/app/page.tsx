"use client";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SignInBox from "@/components/SignInBox";
import StickyNav from "@/components/StickyNav";
import Feature1 from "@/components/Feature1";
import Feature2 from "@/components/Feature2";
import FAQ from "@/components/FAQ";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Transformations for various elements
  const titleOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const titleY = useTransform(scrollY, [0, 300], [0, -100]);
  
  // Original parallax effect
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const elements = container.querySelectorAll('.parallax-element');
      
      elements.forEach((el) => {
        const element = el as HTMLElement;
        const speed = parseFloat(element.dataset.speed || "0.1");
        const direction = element.dataset.direction || "vertical";
        
        if (direction === "vertical") {
          element.style.transform = `translateY(${scrollY * speed}px)`;
        } else if (direction === "horizontal") {
          element.style.transform = `translateX(${scrollY * speed}px)`;
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-[300vh] bg-white text-black relative overflow-hidden">
      {/* Sticky Header Component */}
      <StickyNav />
      
      {/* Hero Section - Updated layout for centered content */}
      <section className="min-h-screen relative flex items-center justify-center">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 lg:gap-24">
          {/* Title content - centered with container */}
          <motion.div 
            className="w-full max-w-lg relative z-10 text-center"
            style={{ opacity: titleOpacity, y: titleY }}
          >
            <motion.h2 
              className="text-5xl md:text-7xl font-bold text-black mb-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Scheduling<br /><span className="text-[#C1121F]">redefined</span>
            </motion.h2>
            <motion.p 
              className="text-black/70 text-xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              by <span className="text-[#C1121F]">Jae</span> <span className="text-black/70">&</span> <span className="text-[#C1121F]">Neil</span>
            </motion.p>
          </motion.div>
          
          {/* Authentication component (SignInBox) */}
          <div className="w-full max-w-md z-20">
            <SignInBox />
          </div>
        </div>

        {/* Decorative elements with subtle parallax effects */}
        <motion.div 
          className="absolute right-[5%] top-20 hidden md:block"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            delay: 0.5 
          }}
          style={{ y: useTransform(scrollY, [0, 1000], [0, -100]) }}
        >
          <div className="w-40 h-40 bg-[#C1121F] rounded-full opacity-80"></div>
        </motion.div>
        
        <motion.div 
          className="absolute left-[5%] top-[15%] hidden md:block"
          style={{ y: useTransform(scrollY, [0, 1000], [0, 50]) }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-16 h-16 border-2 border-[#C1121F]"></div>
        </motion.div>
        
        <motion.div 
          className="absolute left-[5%] bottom-[5%] hidden md:block"
          style={{ y: useTransform(scrollY, [0, 1000], [0, -50]) }}
          whileHover={{ scale: 1.2, color: "#000000" }}
        >
          <div className="text-[#C1121F] text-4xl">×</div>
        </motion.div>
        
        <motion.div 
          className="absolute right-[5%] bottom-[20%] hidden md:block"
          style={{ y: useTransform(scrollY, [0, 1000], [0, 40]) }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-8 h-8 rounded-full border border-[#C1121F] flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-[#C1121F]"></div>
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute left-[20%] bottom-[30%] hidden md:block"
          style={{ y: useTransform(scrollY, [0, 1000], [0, 70]) }}
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="w-3 h-3 bg-[#C1121F]"></div>
        </motion.div>
      </section>

      {/* Adding space before ContentSection */}
      <div className="h-12"></div>

      {/* Content Section now loaded as a component */}
      <div id="features">
        <Feature1 scrollY={scrollY} />
      </div>
      
      {/* Plan with Ease Section */}
      <Feature2 scrollY={scrollY} />
      
      {/* FAQ Section */}
      <FAQ />
    </div>
  );
}
