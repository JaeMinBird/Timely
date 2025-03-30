import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="py-3">
      <button 
        className="flex justify-between items-center w-full text-left focus:outline-none cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-base md:text-lg font-medium text-black">{question}</h3>
        <div className="relative w-6 h-6 flex items-center justify-center">
          <motion.span
            className="absolute w-5 h-0.5 bg-black"
            animate={{ rotate: isOpen ? 135 : 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="absolute w-5 h-0.5 bg-black"
            animate={{ rotate: isOpen ? 45 : 90 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="mt-3 text-base text-[#C1121F]">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const faqItems = [
    {
      question: "How does Timely schedule my meetings?",
      answer: "Just type or say what you need—Timely handles invites, conflicts, and follow-ups automatically."
    },
    {
      question: "Can Timely sync with my existing calendars?",
      answer: "Yes! Timely connects with Google, Outlook, and more to keep everything in sync."
    },
    {
      question: "How much does Timely cost?",
      answer: "Timely is completely free—no hidden fees, no subscriptions."
    }
  ];

  return (
    <section className="mt-[-5rem] pb-36 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          <span className="text-[#C1121F]">Frequently Asked Questions</span>
        </h2>
        <div className="max-w-2xl mx-auto">
          {faqItems.map((item, index) => (
            <FAQItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ; 