# Reel Audio Integration Workflow

## Default
Use internal music library tracks for reels.

## Suno Access Model
1. COO-MUSIC prepares prompts/specs/categories.
2. Noah generates in Suno and exports files.
3. Noah drops exports into `music/inbox/`.
4. CS ingests, tags, and promotes tracks into category folders.

## Steps
1. Pick track by mapping rules in `CONTENT_MAPPING.md`.
2. Trim/loop to reel length.
3. Mix under voice at 10-20% level.
4. Validate with `QA_CHECKLIST.md`.

## Suggested Mix
- Voice: 100%
- Music: 10-20%
- Practical target: -24 dB to -20 dB under voice

## Batch 003 Script
Use:
`instagram/batch_003/reels/render_batch_003.sh`

Expected footage input:
- `instagram/batch_003/reels/input/reel01_noah_take.mp4`
- `instagram/batch_003/reels/input/reel02_noah_take.mp4`

Outputs:
- `instagram/batch_003/reels/output/B003_REEL01_RealPhrase_DRAFT.mp4`
- `instagram/batch_003/reels/output/B003_REEL02_BJJ_DRAFT.mp4`
