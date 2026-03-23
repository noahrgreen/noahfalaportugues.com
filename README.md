# noahfalaportugues.com

A right-sized, authority-oriented first build for Noah Fala Portugues.

## Stack
- Next.js 16 (App Router)
- TypeScript
- Custom CSS
- YouTube Data API v3 (server-side fetch)

## Features (Phase I)
- Hero section with concise positioning
- Latest videos grid from YouTube channel
- Short about section
- Minimal footer with channel link
- Graceful fallback if YouTube API is unavailable

## Local Development
```bash
npm install
npm run dev
```

## Quality Checks
```bash
npm run lint
npm run build
```

## Environment Variables
Copy `.env.example` to `.env.local` and provide values:
- `YOUTUBE_API_KEY`
- `YOUTUBE_CHANNEL_ID` (preferred)
- `YOUTUBE_CHANNEL_HANDLE` (optional)

## Deploy (Vercel)
See `docs/VERCEL-DEPLOYMENT.md`.

## Documentation Packet
- `docs/PROJECT-BRIEF.md`
- `docs/SITEMAP.md`
- `docs/TECH-ARCHITECTURE.md`
- `docs/AESTHETIC-DIRECTION.md`
- `docs/RISK-AND-SCOPE-MEMO.md`
- `docs/BRAND-DIRECTION-PACKET.md`
- `docs/QA-RELEASE-CHECKLIST.md`
- `docs/FINAL-REVIEW-PACKET.md`
