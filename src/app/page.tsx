import Image from "next/image";
import Link from "next/link";
import { getSortedPosts } from "@/content/posts";
import { getLatestVideos } from "@/lib/youtube";

export const revalidate = 21600;

function formatDate(isoDate: string): string {
  if (!isoDate) {
    return "";
  }

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export default async function Home() {
  const videos = await getLatestVideos();
  const latestPost = getSortedPosts()[0];

  return (
    <main className="site-shell page-shell">
      <section className="hero section">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-content">
          <p className="kicker">Noah Fala Português</p>
          <h1>
            Learning Brazilian Portuguese as an adult — clearly, deliberately,
            and for real use.
          </h1>
          <p className="hero-copy">
            Speak naturally. Understand real conversations. Move beyond
            textbook Portuguese.
          </p>
          <div className="hero-actions">
            <a
              className="button button-primary"
              href="https://www.youtube.com/@NoahFalaPortugues"
              target="_blank"
              rel="noreferrer"
            >
              Watch on YouTube
            </a>
            <a className="button button-secondary" href="#ultimos-videos">
              Explore vídeos
            </a>
          </div>
        </div>
      </section>

      <section id="ultimos-videos" className="section">
        <div className="section-header">
          <h2>Últimos vídeos</h2>
          <a
            className="text-link"
            href="https://www.youtube.com/@NoahFalaPortugues/videos"
            target="_blank"
            rel="noreferrer"
          >
            Ver todos
          </a>
        </div>
        <p className="section-intro">
          Recent videos from the channel, focused on real Brazilian Portuguese
          usage, common mistakes, and practical understanding.
        </p>

        <div className="video-grid">
          {videos.map((video) => (
            <article className="video-card" key={video.id}>
              <a href={video.videoUrl} target="_blank" rel="noreferrer">
                <div className="thumb-wrap">
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    width={640}
                    height={360}
                    className="thumb"
                  />
                </div>
              </a>
              <div className="video-meta">
                <h3>
                  <a href={video.videoUrl} target="_blank" rel="noreferrer">
                    {video.title}
                  </a>
                </h3>
                {formatDate(video.publishedAt) ? (
                  <p>{formatDate(video.publishedAt)}</p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section about">
        <h2>Sobre</h2>
        <p>
          Noah Fala Português documents the process of learning Brazilian
          Portuguese as an adult English speaker — with a focus on real
          communication, cultural context, and disciplined study.
        </p>
        <p>
          The goal is not to teach textbook language, but to understand how
          Portuguese is actually used: in conversation, in training
          environments, and in everyday life.
        </p>
        <p>
          This includes patterns that make the language easier to understand,
          mistakes that English speakers tend to make, and observations that
          only become clear through sustained practice.
        </p>
        <p>
          Everything here is part of an ongoing process — structured, practical,
          and grounded in real use.
        </p>
      </section>

      <section className="section flashcards">
        <h2>Flashcards</h2>
        <p>
          I use spaced repetition as part of my study process for Brazilian
          Portuguese.
        </p>
        <p>
          The decks on Brainscape include vocabulary, phrases, and topic-based
          material that I build and refine over time as I learn.
        </p>
        <p>
          They are not a complete system, but a working set of tools tied to
          the way I study and review the language.
        </p>
        <a
          className="button button-primary"
          href="https://www.brainscape.com/profiles/1519861"
          target="_blank"
          rel="noreferrer"
        >
          View my Brainscape profile
        </a>
        <p className="mini-note">Some deck access may require a Brainscape login.</p>
      </section>

      <section className="section blog-preview">
        <div className="section-header">
          <h2>Blog</h2>
          <Link className="text-link" href="/blog">
            Ver blog
          </Link>
        </div>
        <p className="section-intro">
          Reflections, breakdowns, and patterns from learning Brazilian
          Portuguese as an adult.
        </p>
        {latestPost ? (
          <article className="post-preview-card">
            <p className="small-label">Artigo mais recente</p>
            <h3>
              <Link href={`/blog/${latestPost.slug}`}>{latestPost.title}</Link>
            </h3>
            <p>{latestPost.excerpt}</p>
          </article>
        ) : null}
      </section>
    </main>
  );
}
