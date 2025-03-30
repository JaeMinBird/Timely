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
    title: "Character Prefix Conditioning",
    description: "A clever algorithm for more accurate code completion sampling.",
    date: "JANUARY 6, 2025",
    slug: "character-prefix-conditioning",
    author: {
      name: "Jacob",
    },
    readTime: "2 minutes read",
    content: [
      {
        type: 'paragraph',
        content: 'The first in a series of problems that give a glimpse into the work we do at Cursor.'
      },
      {
        type: 'section-header',
        content: 'Setup',
        id: 'setup'
      },
      {
        type: 'paragraph',
        content: 'When using a language model for code completion, we typically want the model to produce a completion that begins with what the user has typed.'
      },
      {
        type: 'paragraph',
        content: 'However, modern language models operate on sequences of tokens, not characters, so naively tokenizing the user\'s input and sending it to the model produces wrong results if the user\'s cursor doesn\'t happen to lie on a token boundary.'
      },
      {
        type: 'paragraph',
        content: 'Instead, we need an algorithm that samples a sequence of tokens conditional on a prefix of characters, rather than the more typical case of sampling conditional on a prefix of tokens.'
      },
      {
        type: 'section-header',
        content: 'Problem',
        id: 'problem'
      },
      {
        type: 'paragraph',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      },
      {
        type: 'section-header',
        content: 'Solution',
        id: 'solution'
      },
      {
        type: 'paragraph',
        content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
      },
      {
        type: 'code',
        content: 'function example() {\n  return "This is a code block";\n}',
        language: 'javascript'
      },
      {
        type: 'paragraph',
        content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.'
      }
    ]
  },
  {
    id: "2",
    title: "INFERENCE CHARACTERISTICS OF LLAMA",
    description: "A PRIMER ON INFERENCE MATH AND EXAMINATION OF THE SURPRISING COSTS",
    date: "FEBRUARY 28, 2023",
    slug: "inference-characteristics-llama",
    author: {
      name: "Alex",
    },
    readTime: "5 minutes read",
    content: [
      {
        type: 'paragraph',
        content: 'This article explores the inference characteristics of LLaMA models.'
      },
      {
        type: 'paragraph',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      }
      // No section headers in this article
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