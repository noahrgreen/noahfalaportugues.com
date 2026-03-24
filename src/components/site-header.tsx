import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="site-header-wrap">
      <div className="site-shell site-header">
        <Link href="/" className="brand-link">
          <Image
            src="/images/noah-logo.png"
            alt="Noah Fala Português logo"
            width={44}
            height={44}
            className="brand-mark"
            priority
          />
          <span>Noah Fala Português</span>
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
          <a
            href="https://www.brainscape.com/profiles/1519861"
            target="_blank"
            rel="noreferrer"
          >
            Brainscape
          </a>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
