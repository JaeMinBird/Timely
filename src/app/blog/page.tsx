"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StickyNav from "@/components/StickyNav";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { blogPosts } from "@/data/blogPosts";

export default function Blog() {
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    setLoaded(true);
  }, []);

  // Handle navigation back to home
  const goToHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white text-black relative">
      {/* Sticky Header Component */}
      <StickyNav />
      
      {/* Blog Header - Centered */}
      <div className="container mx-auto px-4 md:px-8 pt-32 pb-10 text-center">
        <motion.h1 
          className="text-6xl md:text-8xl font-bold text-[#C1121F] mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
          transition={{ duration: 0.5 }}
        >
          BLOG
        </motion.h1>
        <motion.p 
          className="text-lg text-black/70 font-['Geist_Mono'] uppercase tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Compiled notes from the team
        </motion.p>
      </div>

      {/* Article Cards Section */}
      <div className="container mx-auto px-4 md:px-8 pb-24">
        <div className="flex flex-col">
          {blogPosts.map((post, index) => (
            <motion.div 
              key={post.id}
              className="border-t border-black/10 py-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
            >
              <Link href={`/blog/${post.slug}`} className="block group">
                <div className="flex flex-col md:flex-row justify-between items-start">
                  <div className="md:w-3/4">
                    <p className="text-sm font-['Geist_Mono'] text-black/50 mb-2">
                      {post.date}
                    </p>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-['Geist_Mono'] tracking-tight text-black group-hover:text-[#C1121F] transition-colors">
                      {post.title.toUpperCase()}
                    </h2>
                    <p className="text-lg md:text-xl text-black/70 font-['Geist_Mono'] tracking-tight">
                      {post.description.toUpperCase()}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div className="inline-flex items-center text-[#C1121F] group-hover:translate-x-2 transition-transform font-['Geist_Mono']">
                      <span className="mr-2">VIEW ARTICLE</span>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        {/* Back to Home Button */}
        <motion.div 
          className="mt-16 border-t border-black/10 pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <button 
            onClick={goToHome}
            className="font-['Geist_Mono'] text-[#C1121F] hover:underline flex items-center cursor-pointer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            BACK TO HOME
          </button>
        </motion.div>
      </div>
    </div>
  );
} 