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

        <div className="article-links">
          <a
            className="button button-primary"
            href="https://www.brainscape.com/profiles/1519861"
            target="_blank"
            rel="noreferrer"
          >
            View my Brainscape profile
          </a>
          <a
            className="text-link"
            href="https://www.brainscape.com/academy/spaced-repetition/"
            target="_blank"
            rel="noreferrer"
          >
            Further reading on spaced repetition
          </a>
          <Link className="text-link" href="/blog">
            Back to blog
          </Link>
        </div>
      </section>
    </main>
  );
}
