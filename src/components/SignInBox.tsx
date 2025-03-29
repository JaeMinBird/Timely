"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

export default function SignInBox() {
  const { data: session } = useSession();

  const handleGoogleSignIn = () => {
    signIn("google");
  };

  return (
    <motion.div 
      className="bg-white p-6 rounded-xl shadow-md border-2 border-[#C1121F] max-w-md w-full"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 1 }}
    >
      {session ? (
        <div className="text-center">
          <p className="mb-4">Signed in as {session.user?.email}</p>
          <motion.button
            className="bg-[#C1121F] text-white rounded-full py-3 px-4 font-medium"
            whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            onClick={() => signOut()}
          >
            Sign Out
          </motion.button>
        </div>
      ) : (
        <>
          <motion.div
            className="w-full mb-4"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.button 
              className="flex items-center justify-center w-full bg-white border border-gray-300 rounded-full py-3 px-4 transition-colors"
              whileHover={{ 
                borderColor: "#C1121F",
                backgroundColor: "rgba(255, 255, 255, 0.9)"
              }}
              initial={{ boxShadow: "0px 0px 0px rgba(0,0,0,0)" }}
              animate={{
                boxShadow: ["0px 0px 0px rgba(0,0,0,0)", "0px 4px 12px rgba(193, 18, 31, 0.1)", "0px 0px 0px rgba(0,0,0,0)"],
              }}
              transition={{
                boxShadow: {
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 2,
                }
              }}
              layout
              onClick={handleGoogleSignIn}
            >
              <motion.div layout>
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                  alt="Google logo"
                  width={20}
                  height={20}
                  className="mr-2"
                />
              </motion.div>
              <motion.span className="text-gray-700" layout>Continue with Google</motion.span>
            </motion.button>
          </motion.div>
          
          <motion.div
            className="w-full mb-4"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.button 
              className="flex items-center justify-center w-full bg-white border border-gray-300 rounded-full py-3 px-4 transition-colors"
              whileHover={{ 
                borderColor: "#C1121F",
                backgroundColor: "rgba(255, 255, 255, 0.9)"
              }}
              initial={{ boxShadow: "0px 0px 0px rgba(0,0,0,0)" }}
              animate={{
                boxShadow: ["0px 0px 0px rgba(0,0,0,0)", "0px 4px 12px rgba(193, 18, 31, 0.1)", "0px 0px 0px rgba(0,0,0,0)"],
              }}
              transition={{
                boxShadow: {
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 2,
                }
              }}
              layout
            >
              <motion.div layout>
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                  alt="Microsoft logo"
                  width={20}
                  height={20}
                  className="mr-2"
                />
              </motion.div>
              <motion.span className="text-gray-700" layout>Continue with Microsoft</motion.span>
            </motion.button>
          </motion.div>
          
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-[#C1121F]"></div>
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <div className="flex-grow h-px bg-[#C1121F]"></div>
          </div>
          
          <input 
            type="email" 
            placeholder="Enter your personal or work email"
            className="w-full border border-gray-300 rounded-full py-3 px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-[#C1121F]/30 focus:border-[#C1121F]"
          />
          
          <motion.button 
            className="w-full bg-black text-white rounded-full py-3 px-4 mb-4 font-medium hover:bg-gray-900 transition-colors"
            whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            Continue with email
          </motion.button>
          
          <p className="text-gray-500 text-xs text-center mt-3">
            By continuing, you agree to Anthropic's <span className="text-[#C1121F]">Consumer Terms</span> and <span className="text-[#C1121F]">Usage Policy</span>, and acknowledge their <span className="text-[#C1121F]">Privacy Policy</span>.
          </p>
        </>
      )}
    </motion.div>
  );
} 