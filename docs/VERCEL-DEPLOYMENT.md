# Vercel Deployment Notes

## Local Commands
- `npm install`
- `npm run lint`
- `npm run build`

## Deploy
1. Import repository in Vercel or run `vercel` from project root.
2. Set environment variables:
   - `YOUTUBE_API_KEY`
   - `YOUTUBE_CHANNEL_ID` (preferred)
   - `YOUTUBE_CHANNEL_HANDLE` (optional)
3. Trigger deployment.

## Post-Deploy Checks
- Home renders with hero and clean styling.
- Latest videos section loads.
- Fallback messaging appears gracefully if API unavailable.
