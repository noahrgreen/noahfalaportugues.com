import Link from "next/link";
import { getSortedPosts } from "@/content/posts";

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export default function BlogPage() {
  const posts = getSortedPosts();
  const [latest, ...rest] = posts;

  return (
    <main className="site-shell page-shell">
      <section className="section">
        <h1>Blog</h1>
        <p className="section-intro">
          Reflections, breakdowns, and study notes from learning Brazilian
          Portuguese as an adult.
        </p>
      </section>

      {latest ? (
        <section className="section">
          <p className="small-label">Artigo mais recente</p>
          <article className="featured-post">
            {latest.tag ? <span className="tag-pill">{latest.tag}</span> : null}
            <h2>
              <Link href={`/blog/${latest.slug}`}>{latest.title}</Link>
            </h2>
            <p className="meta-row">{formatDate(latest.date)}</p>
            <p>{latest.excerpt}</p>
          </article>
        </section>
      ) : null}

      {rest.length > 0 ? (
        <section className="section">
          <h2>Artigos recentes</h2>
          <div className="post-list">
            {rest.map((post) => (
              <article className="post-item" key={post.slug}>
                {post.tag ? <span className="tag-pill">{post.tag}</span> : null}
                <h3>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="meta-row">{formatDate(post.date)}</p>
                <p>{post.excerpt}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
