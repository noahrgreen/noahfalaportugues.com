import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getSortedPosts } from "@/content/posts";

type Params = {
  slug: string;
};

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function generateStaticParams() {
  return getSortedPosts().map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="site-shell page-shell">
      <section className="section article-shell">
        <p className="small-label">Blog</p>
        <h1>{post.title}</h1>
        <p className="meta-row">{formatDate(post.date)}</p>

        <div className="article-body">
          {post.content.map((paragraph, idx) => (
            <p key={`${post.slug}-${idx}`}>{paragraph}</p>
          ))}
        </div>

        <aside className="callout-box">
          <p className="small-label">Study tools</p>
          <p>Explore my Brainscape decks.</p>
          <a
            className="button button-primary"
            href="https://www.brainscape.com/profiles/1519861"
            target="_blank"
            rel="noreferrer"
          >
            View my Brainscape profile
          </a>
        </aside>

        <aside className="callout-box muted-callout">
          <p className="small-label">Further reading</p>
          <a
            className="text-link"
            href="https://www.brainscape.com/academy/spaced-repetition/"
            target="_blank"
            rel="noreferrer"
          >
            Brainscape on spaced repetition
          </a>
        </aside>

        <div className="article-links">
          <Link className="text-link" href="/blog">
            Back to blog
          </Link>
        </div>
      </section>
    </main>
  );
}
