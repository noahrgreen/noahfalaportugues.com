export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tag?: string;
  content: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-i-use-spaced-repetition-to-study-brazilian-portuguese",
    title: "How I Use Spaced Repetition to Study Brazilian Portuguese",
    date: "2026-03-23",
    tag: "Study Method",
    excerpt:
      "A practical look at why spaced repetition helps with retention, where it fits, and where it does not.",
    content: [
      "Spaced repetition is one of the few study methods that consistently holds up over time.",
      "At a basic level, it means reviewing information at increasing intervals — just before you would normally forget it. Done correctly, it helps move vocabulary and phrases from short-term memory into something more durable.",
      "For an adult learner, this matters.",
      "You are not absorbing language the way a child does. You are managing time, attention, and competing priorities. That makes efficiency important.",
      "In Brazilian Portuguese, spaced repetition is especially useful for vocabulary that appears frequently but is easy to confuse, phrases that need to be recalled quickly in conversation, and patterns that only become automatic through repetition.",
      "That said, flashcards alone are not enough.",
      "They do not replace listening to real speech, reading natural text, or interacting with the language in context. They are one tool — but a useful one when used correctly.",
      "I use Brainscape as part of this process. The decks there are not static; they evolve as I encounter new vocabulary, correct mistakes, and refine what is actually worth remembering.",
      "If you are new to spaced repetition, Brainscape also has a clear explanation of how it works and why it is effective.",
      "The key point is simple: you do not need more information. You need better retention.",
    ],
  },
  {
    slug: "patterns-i-keep-noticing-in-brazilian-portuguese",
    title: "Patterns I Keep Noticing in Brazilian Portuguese",
    date: "2026-03-18",
    tag: "Reflections",
    excerpt:
      "A short breakdown of recurring patterns that make spoken Brazilian Portuguese easier to process in real conversations.",
    content: [
      "This is a rolling note on recurring patterns that keep showing up in real speech.",
      "I treat this as a practical log: what I hear, what I misread, and what improved once I paid closer attention to context.",
    ],
  },
];

export function getSortedPosts(): BlogPost[] {
  return [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
