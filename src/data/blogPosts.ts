// Blog post data structure with support for section headers
export interface BlogPost {
  id: string;
  title: string;
  description: string;
  date: string;
  slug: string;
  author: {
    name: string;
  };
  readTime: string;
  content: ContentBlock[];
}

export interface ContentBlock {
  type: 'paragraph' | 'section-header' | 'code' | 'image';
  content: string;
  id?: string; // Used for section navigation
  language?: string; // For code blocks
  alt?: string; // For images
}

// Sample blog posts data
export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Designing the Timely Chat Interface",
    description: "Building an intuitive calendar assistant with Next.js and Framer Motion.",
    date: "MARCH 29, 2024",
    slug: "timely-chat-interface",
    author: {
      name: "Jae",
    },
    readTime: "4 minutes read",
    content: [
      {
        type: 'paragraph',
        content: 'Creating an intuitive chat interface for our calendar app, Timely, presented several design challenges that had to balance functionality with user experience. This article explores our approach to building the chat page that serves as the central interaction point for our scheduling assistant.'
      },
      {
        type: 'section-header',
        content: 'Design Goals',
        id: 'design-goals'
      },
      {
        type: 'paragraph',
        content: 'When designing the chat interface, we had several key objectives: it needed to feel familiar to users of modern messaging apps, provide contextual information about calendar events, and maintain a clean, distraction-free environment. Most importantly, it needed to make scheduling events as frictionless as possible.'
      },
      {
        type: 'paragraph',
        content: 'We chose to implement the interface as a dedicated page in our Next.js application, with a sidebar for chat history and a main content area for the conversation itself.'
      },
      {
        type: 'section-header',
        content: 'Component Architecture',
        id: 'component-architecture'
      },
      {
        type: 'paragraph',
        content: 'The chat page architecture consists of several key components:'
      },
      {
        type: 'paragraph',
        content: '1. ChatPage - The main container component\n2. ChatSidebar - Collapsible sidebar for chat history and user controls\n3. ChatList - Displays previous conversations\n4. Message display area - Shows the ongoing conversation\n5. Input area - For user message entry\n6. CalendarEventCard - Displays detected events\n7. Success animations - Provides feedback on calendar operations'
      },
      {
        type: 'code',
        content: 'export default function ChatPage() {\n  const [messages, setMessages] = useState<Message[]>([]);\n  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);\n  const [currentChatId, setCurrentChatId] = useState<string | null>(null);\n  const [modelProvider, setModelProvider] = useState<\'openai\' | \'gemini\'>(\'openai\');\n  // ...other state variables\n\n  // Render layout with sidebar and main content area\n  return (\n    <div className="flex h-screen bg-white text-black">\n      <ChatSidebar />\n      <div className="flex-1 flex flex-col">{\n        /* Chat content and input */}\n      </div>\n    </div>\n  );\n}',
        language: 'typescript'
      },
      {
        type: 'section-header',
        content: 'Responsive Considerations',
        id: 'responsive-design'
      },
      {
        type: 'paragraph',
        content: 'The chat interface needed to work seamlessly on both desktop and mobile devices. To accomplish this, we implemented a collapsible sidebar that responds to screen size, combined with touch-friendly controls and carefully considered spacing.'
      },
      {
        type: 'paragraph',
        content: 'On mobile devices, the sidebar collapses fully and can be accessed via a hamburger menu, while on desktop it can be toggled between a compact view showing only icons and an expanded view with full text labels.'
      },
      {
        type: 'code',
        content: '// Mobile viewport detection\nuseEffect(() => {\n  const checkMobile = () => {\n    setIsMobile(window.innerWidth < 768);\n  };\n  \n  // Initial check\n  checkMobile();\n  \n  // Add resize listener\n  window.addEventListener(\'resize\', checkMobile);\n  \n  // Cleanup\n  return () => window.removeEventListener(\'resize\', checkMobile);\n}, []);',
        language: 'typescript'
      },
      {
        type: 'section-header',
        content: 'Animation with Framer Motion',
        id: 'animations'
      },
      {
        type: 'paragraph',
        content: 'To create a polished, engaging user experience, we incorporated subtle animations using Framer Motion. These include smooth transitions for the sidebar, message appear/disappear effects, and success animations when calendar events are created.'
      },
      {
        type: 'code',
        content: '<motion.div \n  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"\n  initial={{ opacity: 0 }}\n  animate={{ opacity: 1 }}\n  exit={{ opacity: 0 }}\n  onClick={onClose}\n>\n  <motion.div \n    className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full flex flex-col items-center"\n    initial={{ scale: 0.8, y: 20, opacity: 0 }}\n    animate={{ \n      scale: 1, \n      y: 0, \n      opacity: 1,\n      transition: { delay: 0.1, type: "spring", damping: 12 }\n    }}\n    exit={{ scale: 0.8, y: 20, opacity: 0 }}\n  >\n    {/* Success animation content */}\n  </motion.div>\n</motion.div>',
        language: 'typescript'
      },
      {
        type: 'section-header',
        content: 'State Management Challenges',
        id: 'state-management'
      },
      {
        type: 'paragraph',
        content: 'Managing the chat state presented several challenges, particularly around message persistence, history navigation, and ensuring a responsive interface even during API calls.'
      },
      {
        type: 'paragraph',
        content: 'We implemented a dual storage approach, saving chat data both locally using localStorage for immediate availability and to MongoDB for persistence across devices. This approach allows for offline functionality and reduces load times for returning users.'
      },
      {
        type: 'code',
        content: '// Load chat data from localStorage on initial load\nuseEffect(() => {\n  if (typeof window !== \'undefined\' && session?.user) {\n    const { chats, messages } = loadLocalChatData();\n    setChatHistory(chats || []);\n    setAllMessages(messages || {});\n  }\n}, [session]);\n\n// Save chat data to localStorage whenever it changes\nuseEffect(() => {\n  if (chatHistory.length > 0 || Object.keys(allMessages).length > 0) {\n    saveLocalChatData(chatHistory, allMessages);\n  }\n}, [chatHistory, allMessages]);',
        language: 'typescript'
      },
      {
        type: 'section-header',
        content: 'Next Steps',
        id: 'next-steps'
      },
      {
        type: 'paragraph',
        content: 'As we continue to improve the chat interface, we\'re focusing on several key areas:'
      },
      {
        type: 'paragraph',
        content: '- Enhanced message formatting for better readability of calendar information\n- Drag-and-drop functionality for rescheduling events directly in the chat\n- Voice input for hands-free scheduling\n- Improved offline capabilities with service workers\n- Accessibility improvements for screen readers and keyboard navigation'
      },
      {
        type: 'paragraph',
        content: 'The chat interface serves as the primary touchpoint for users interacting with our AI calendar assistant, and continually refining this experience remains a core focus of our development efforts.'
      }
    ]
  }
];

// Helper function to get a post by slug
export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

// Helper function to check if a post has sections
export function hasNavSections(post: BlogPost): boolean {
  return post.content.some(block => block.type === 'section-header');
}

// Helper function to extract sections from a post
export function getPostSections(post: BlogPost): { id: string; title: string }[] {
  return post.content
    .filter(block => block.type === 'section-header' && block.id)
    .map(block => ({
      id: block.id!,
      title: block.content
    }));
}

// Helper function to convert content blocks to HTML
export function contentToHtml(content: ContentBlock[]): string {
  return content.map(block => {
    switch (block.type) {
      case 'paragraph':
        return `<p>${block.content}</p>`;
      case 'section-header':
        return `<h2 id="${block.id}" class="blog-section-header">${block.content}</h2>`;
      case 'code':
        return `<pre><code class="language-${block.language || ''}">${block.content}</code></pre>`;
      case 'image':
        return `<img src="${block.content}" alt="${block.alt || ''}" class="w-full rounded-lg" />`;
      default:
        return '';
    }
  }).join('\n');
} 