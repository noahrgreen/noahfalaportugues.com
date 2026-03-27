# Canva Template System V2 — Implementation Notes

## Canva Access
Configured via runtime environment with CANVA_URL and credentials in secret env.
Smoke test evidence: CANVA_SMOKE_TEST.png

## Locked Template Set
1. Carousel Cover
2. Carousel Content Slide
3. Reel Cover
4. Single Post (reserved, not used in Batch 003)

## Global Rules Enforced
1. No paragraphs on slides.
2. No more than 12 words per slide.
3. No emojis in graphics.
4. No direct Canva template reuse.
5. No more than 2 fonts.

## Visual Rules Enforced
1. Cover slides use full-bleed Rio imagery + 40–60% overlay.
2. Content slides use neutral or blurred Brazil context backgrounds.
3. Reel covers use tighter composition + stronger contrast.
4. Watermark fixed bottom-right, ~10–12% width.

## Hook + Readability Upgrades
1. All cover hooks rewritten for tension/curiosity.
2. Interior text compressed for fast scanning.
3. Contrast tuned for feed thumbnail performance.

## Batch 003 Outcome
- Template logic: APPLIED
- Visual consistency: PASS
- IG-native formatting: PASS
