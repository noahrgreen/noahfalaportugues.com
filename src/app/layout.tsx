import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
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
  title: "Noah Fala Portugues",
  description:
    "Brazilian Portuguese for English speakers: practical usage, structure, and cultural context.",
  metadataBase: new URL("https://noahfalaportugues.com"),
  openGraph: {
    title: "Noah Fala Portugues",
    description:
      "Brazilian Portuguese for English speakers: practical usage, structure, and cultural context.",
    type: "website",
    url: "https://noahfalaportugues.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
