# Risk and Scope Memo

## Scope Controls Applied
- Single-page architecture only
- No monetization or lead-capture systems
- No CMS or account system
- No public-facing internal systems language

## Risks Identified
1. YouTube API quota/credential configuration errors.
2. Channel metadata mismatch (missing channel ID).
3. Brand tone drift if copy gets expanded casually.

## Mitigations
- Fallback rendering path when API fails.
- Optional `YOUTUBE_CHANNEL_HANDLE` resolution support.
- Copy constrained to concise, authority-aligned wording.

## Out-of-Scope Enforcement
Any new feature beyond mission requires explicit change note and approval.
