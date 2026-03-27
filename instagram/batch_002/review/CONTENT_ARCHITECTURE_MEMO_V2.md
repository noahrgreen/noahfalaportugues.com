# Instagram Content Architecture Correction — Implemented (Batch 002)

## What Was Corrected
1. Removed faux-slide logic from single static posts by enforcing content-type routing.
2. Added strict format mapping: carousel concepts are delivered as true multi-asset carousels.
3. Reels are now defined as video objects with storyboard + subtitle plan + dedicated covers.
4. Approval chain now requires exact filename match before any upload action.

## Format Routing Rules (Active)
- Carousel: educational/saveable content (4–6 slides).
- Reel: phrase, pronunciation, BJJ command, progress clips (video-first).
- Story: informal updates, polls, reposts.
- Single static image: one idea only (not used in this batch for slide-style content).

## Batch 002 Mix
- 3 carousels
- 2 reels

## Visual System
- Keeps website-aligned palette (green/cream, restrained contrast).
- Reduced text density and boxiness.
- Reduced watermark size (10% width) with consistent position.
- De-emphasized "POST XX" framing.
- Uses Rio imagery as atmosphere:
  - strong on covers
  - blurred/tinted on interior slides

## Upload Governance
- No upload executed in this correction sprint.
- Upload only after explicit approval and filename match verification.
