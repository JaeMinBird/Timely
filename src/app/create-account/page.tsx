"use client";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CreateAccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Redirect to home if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/');
    }
  }, [status, router]);

  // Handler for "Use a different email" link
  const handleUseDifferentEmail = async (e: React.MouseEvent) => {
    e.preventDefault();
    // Sign out the user and redirect to home page
    await signOut({ redirect: false });
    router.push('/');
  };

  if (status === "loading") {
    // Show loading state
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-[#C1121F] text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null; // Don't render anything while checking session
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-6">
      <div className="flex items-center mb-10">
        {/* Use your timely logo from StickyHeader */}
        <svg 
          className="w-8 h-8 text-[#C1121F] mr-3" 
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
        <h1 className="text-2xl font-bold text-[#C1121F] boldonse-regular">timely</h1>
      </div>

      <motion.h2 
        className="text-3xl mb-8 font-bold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        First, let's create your account
      </motion.h2>

      <div className="w-full max-w-md">
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-base mb-3 text-center">Verify your age</h3>
          <div className="flex items-center bg-white p-3 rounded-lg border border-gray-300">
            <input 
              type="checkbox" 
              id="ageCheck" 
              className="mr-3 h-4 w-4 accent-[#C1121F]" 
            />
            <label htmlFor="ageCheck" className="text-black/80 text-sm">
              I confirm that I am at least 18 years of age
            </label>
          </div>
        </motion.div>

        <motion.button 
          className="w-full py-2.5 px-3.5 rounded-lg bg-white text-black hover:bg-[#C1121F] hover:text-white 
                    transition-colors mb-6 border border-gray-400 hover:border-[#C1121F] text-sm font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/chat')}
        >
          Continue
        </motion.button>
      </div>
      
      {/* Email verification info at the bottom */}
      <div className="absolute bottom-6 text-center text-xs text-gray-600">
        <p>Email verified as {session.user?.email}</p>
        <a 
          href="#" 
          className="text-[#C1121F] hover:underline"
          onClick={handleUseDifferentEmail}
        >
          Use a different email
        </a>
      </div>
    </div>
  );
} 