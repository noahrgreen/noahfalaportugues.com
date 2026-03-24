import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="site-header-wrap">
      <div className="site-shell site-header">
        <Link href="/" className="brand-link">
          Noah Fala Português
        </Link>
        <nav className="main-nav" aria-label="Main">
          <Link href="/">Início</Link>
          <Link href="/blog">Blog</Link>
          <a
            href="https://www.youtube.com/@NoahFalaPortugues"
            target="_blank"
            rel="noreferrer"
          >
            YouTube
          </a>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
