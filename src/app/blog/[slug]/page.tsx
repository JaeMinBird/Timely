"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import StickyNav from "@/components/StickyNav";
import Link from "next/link";
import { 
  getPostBySlug, 
  hasNavSections,
  getPostSections,
  contentToHtml,
  type BlogPost
} from "@/data/blogPosts";

export default function BlogPost() {
  const params = useParams();
  const [loaded, setLoaded] = useState(false);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [activeSection, setActiveSection] = useState("");
  const [hasSections, setHasSections] = useState(false);
  const [sections, setSections] = useState<{id: string; title: string}[]>([]);
  const [contentHtml, setContentHtml] = useState("");
  const { slug } = params;
  
  useEffect(() => {
    setLoaded(true);
    
    // Get the post data from the data file
    const currentSlug = Array.isArray(slug) ? slug[0] : slug;
    const postData = getPostBySlug(currentSlug as string);
    
    if (postData) {
      setPost(postData);
      
      // Check if the post has sections for navigation
      const postHasSections = hasNavSections(postData);
      setHasSections(postHasSections);
      
      // Get sections for navigation if available
      if (postHasSections) {
        setSections(getPostSections(postData));
      }
      
      // Convert content blocks to HTML
      setContentHtml(contentToHtml(postData.content));
    }
    
    // Add scroll event listener to update active section
    const handleScroll = () => {
      const sectionElements = document.querySelectorAll('h2[id]');
      let currentActiveSection = "";
      
      sectionElements.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100) {
          currentActiveSection = section.id;
        }
      });
      
      if (currentActiveSection !== activeSection) {
        setActiveSection(currentActiveSection);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [slug, activeSection]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[#C1121F]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black relative">
      {/* Add custom styles for section headers */}
      <style jsx global>{`
        .blog-section-header {
          font-size: 2rem;
          font-weight: 700;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          color: #000;
          font-family: 'Geist Mono', monospace;
          letter-spacing: -0.5px;
        }
      `}</style>
      
      <StickyNav />
      
      <div className="container mx-auto px-4 md:px-8 pt-24 pb-24">
        {/* Back button - reduced padding to decrease distance to the date */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: loaded ? 1 : 0, x: loaded ? 0 : -20 }}
          transition={{ duration: 0.3 }}
          className="mb-5 w-full md:max-w-[60%] md:mx-auto pt-3"
        >
          <Link href="/blog" className="inline-flex items-center text-[#C1121F] hover:translate-x-[-8px] transition-transform font-['Geist_Mono']">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>BACK TO THE MAIN BLOG</span>
          </Link>
        </motion.div>
        
        {/* Main content container */}
        <div className="md:flex md:flex-row">
          {/* Section Navigation Sidebar - Only visible on desktop and positioned at the far left */}
          {hasSections && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: loaded ? 1 : 0, x: loaded ? 0 : -20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="hidden md:block md:w-1/5 md:sticky md:top-24 md:self-start md:pr-8"
            >
              <nav className="space-y-3">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={`block text-sm hover:text-[#C1121F] transition-colors font-['Geist_Mono'] ${
                      activeSection === section.id ? 'text-[#C1121F]' : 'text-black/70'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </motion.div>
          )}
          
          {/* Main Content - Centered in desktop regardless of sidebar */}
          <div className={`w-full ${hasSections ? 'md:flex-1' : 'md:max-w-[60%] md:mx-auto'}`}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: loaded ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-4 text-black/60 text-sm font-['Geist_Mono']"
            >
              {post.date}
            </motion.div>
            
            {/* Post Header */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl font-bold text-[#C1121F] mb-6"
            >
              {post.title}
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 text-black/70"
            >
              <p>{post.description}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-12 border-b border-black/10 pb-6"
            >
              <div>
                <p className="text-black font-['Geist_Mono']">Posted By {post.author.name}</p>
                <p className="text-black/50 text-sm font-['Geist_Mono']">{post.readTime}</p>
              </div>
            </motion.div>
            
            {/* Post Content - Using default font instead of Geist Mono for body text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </div>
          
          {/* Empty column to balance the layout if there's a sidebar */}
          {hasSections && (
            <div className="hidden md:block md:w-1/5"></div>
          )}
        </div>
      </div>
    </div>
  );
} 