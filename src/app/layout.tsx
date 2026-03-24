import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const sans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
});

const serif = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Noah Fala Português",
  description:
    "Learning Brazilian Portuguese as an adult — clearly, deliberately, and for real use.",
  metadataBase: new URL("https://noahfalaportugues.com"),
  openGraph: {
    title: "Noah Fala Português",
    description:
      "Learning Brazilian Portuguese as an adult — clearly, deliberately, and for real use.",
    type: "website",
    url: "https://noahfalaportugues.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setTheme = `
(function() {
  try {
    var stored = localStorage.getItem('nfp-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (prefersDark ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
  } catch (e) {
    document.documentElement.dataset.theme = 'light';
  }
})();`;

  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: setTheme }} />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
