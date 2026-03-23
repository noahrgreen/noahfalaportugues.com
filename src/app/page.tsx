import Image from "next/image";
import { getLatestVideos } from "@/lib/youtube";

export const revalidate = 21600;

function formatDate(isoDate: string): string {
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
  const { videos, usedFallback } = await getLatestVideos();

  return (
    <main className="page-shell">
      <section className="hero section">
        <p className="kicker">Noah Fala Portugues</p>
        <h1>Brazilian Portuguese for English speakers, built for real use.</h1>
        <p className="hero-copy">
          Clear structure, practical communication, and cultural context without
          noise.
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
          <a className="button button-secondary" href="#latest-videos">
            Explore videos
          </a>
        </div>
      </section>

      <section id="latest-videos" className="section">
        <div className="section-header">
          <h2>Latest videos</h2>
          <a
            className="text-link"
            href="https://www.youtube.com/@NoahFalaPortugues/videos"
            target="_blank"
            rel="noreferrer"
          >
            View all
          </a>
        </div>

        {usedFallback ? (
          <p className="support-note">
            Live feed is temporarily unavailable. You can still access the
            channel directly.
          </p>
        ) : null}

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
                {video.publishedAt ? (
                  <p>{formatDate(video.publishedAt)}</p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section about">
        <h2>About</h2>
        <p>
          Noah Fala Portugues is an English-language-facing Brazilian
          Portuguese project focused on practical communication, disciplined
          study, and cultural seriousness.
        </p>
      </section>

      <footer className="site-footer section">
        <p>© {new Date().getFullYear()} Noah Fala Portugues</p>
        <a
          href="https://www.youtube.com/@NoahFalaPortugues"
          target="_blank"
          rel="noreferrer"
        >
          YouTube
        </a>
      </footer>
    </main>
  );
}
