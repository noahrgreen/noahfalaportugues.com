# Tech Architecture

## Stack
- Next.js 16 (App Router)
- TypeScript
- CSS (custom global stylesheet)
- Vercel-compatible deployment

## Architectural Choices
1. Static-first page rendering with periodic revalidation (`21600` seconds).
2. Server-side YouTube API retrieval in `src/lib/youtube.ts`.
3. Minimal data model for display cards:
   - `id`
   - `title`
   - `thumbnailUrl`
   - `publishedAt`
   - `videoUrl`
4. Graceful fallback when API is unavailable.

## YouTube Integration
- Uses YouTube Data API v3 endpoint:
  - `channels.list` (optional handle to channel ID resolution)
  - `search.list` (latest videos by channel)
- API key remains server-side via runtime env var.

## Error Handling
- No raw API errors are rendered publicly.
- UI remains intact with a clean fallback message and channel link.

## Files of Record
- `src/lib/youtube.ts`
- `src/types/video.ts`
- `src/app/page.tsx`
- `next.config.ts`
- `.env.example`
