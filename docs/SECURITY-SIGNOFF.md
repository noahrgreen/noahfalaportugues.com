# Security Sign-Off

## Secret Handling
- API key is server-side only (`process.env.YOUTUBE_API_KEY`).
- No secret values are committed in repo files.
- `.env.example` includes placeholders only.

## Repo Hygiene
- No absolute secret paths in application code.
- No credential artifacts in source tree.
- Public UI does not expose raw API errors.

## Operational Requirement
Set runtime environment variables in Vercel project settings before deploy.

## Status
Security review: Pass for Phase I scope.
