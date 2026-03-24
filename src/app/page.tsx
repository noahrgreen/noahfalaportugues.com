import Image from "next/image";
import Link from "next/link";
import { getSortedPosts } from "@/content/posts";
import { getLatestVideos } from "@/lib/youtube";

export const revalidate = 21600;

function formatDate(isoDate: string): string {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export default async function Home() {
  const videos = await getLatestVideos();
  const posts = getSortedPosts();
  const latestPost = posts[0];
  const secondaryPosts = posts.slice(1, 3);

  return (
    <main className="site-shell page-shell">
      <section className="hero section">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-content">
          <p className="kicker">NOAH FALA PORTUGUÊS</p>
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

      <section className="section start-here">
        <p className="small-label">Comece aqui</p>
        <h2>Start here</h2>
        <p className="section-intro">
          If you&apos;re new here, start with the videos and tools that best show
          how I&apos;m learning Brazilian Portuguese in practice.
        </p>

        <div className="start-grid">
          <article className="start-card">
            <p className="small-label">Vídeo</p>
            <h3>Best introductory video</h3>
            <p>A focused entry point for how this study process is structured.</p>
          </article>
          <article className="start-card">
            <p className="small-label">Flashcards</p>
            <h3>Brainscape study decks</h3>
            <p>Vocabulary and phrase sets used for active spaced review.</p>
          </article>
          <article className="start-card">
            <p className="small-label">Blog</p>
            <h3>Spaced repetition study note</h3>
            <p>A short breakdown of method, limits, and practical use.</p>
          </article>
        </div>

        <div className="cta-row">
          <a
            className="button button-primary"
            href="https://www.youtube.com/@NoahFalaPortugues"
            target="_blank"
            rel="noreferrer"
          >
            Subscribe on YouTube
          </a>
          <a
            className="button button-neutral"
            href="https://www.youtube.com/@NoahFalaPortugues/videos"
            target="_blank"
            rel="noreferrer"
          >
            View all vídeos
          </a>
        </div>
        <p className="mini-note">
          Follow the process, the materials, and the lessons learned along the
          way.
        </p>
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
          {videos.slice(0, 6).map((video) => (
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

      <section className="section flashcards split-section">
        <div>
          <p className="small-label">Flashcards</p>
          <h2>Study tools I actually use</h2>
          <p>
            I use spaced repetition as part of my Brazilian Portuguese study
            process. These Brainscape decks include vocabulary, phrases, and
            topic-based material that I build and refine over time.
          </p>
          <a
            className="button button-primary"
            href="https://www.brainscape.com/profiles/1519861"
            target="_blank"
            rel="noreferrer"
          >
            Ver meus decks no Brainscape
          </a>
          <p className="mini-note">
            Alguns decks podem exigir login no Brainscape.
          </p>
        </div>

        <aside className="deck-preview" aria-label="Example decks">
          <p className="small-label">Deck samples</p>
          <ul>
            <li>Extensive Portuguese – English Vocabulary Pairs</li>
            <li>
              Hespect! English-Portuguese Phrases, Vocabulary And Verbs For
              Brazilian-Jiu Jitsu
            </li>
            <li>
              Business Terms (Finance, Accounting, Legal, Brazilian Portuguese
              English Terms)
            </li>
          </ul>
        </aside>
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

      <section className="section blog-preview">
        <div className="section-header">
          <div>
            <p className="small-label">Blog</p>
            <h2>Reflections and study notes</h2>
          </div>
          <Link className="text-link" href="/blog">
            Ver blog
          </Link>
        </div>
        <p className="section-intro">
          Notes on methods, tools, mistakes, patterns, and what seems to matter
          most in learning Brazilian Portuguese as an adult.
        </p>

        {latestPost ? (
          <article className="post-preview-card featured-home-post">
            <p className="small-label">Artigo mais recente</p>
            <h3>
              <Link href={`/blog/${latestPost.slug}`}>{latestPost.title}</Link>
            </h3>
            <p>{latestPost.excerpt}</p>
          </article>
        ) : null}

        {secondaryPosts.length > 0 ? (
          <div className="blog-secondary-grid">
            {secondaryPosts.map((post) => (
              <article className="post-preview-card" key={post.slug}>
                <h3>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p>{post.excerpt}</p>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
