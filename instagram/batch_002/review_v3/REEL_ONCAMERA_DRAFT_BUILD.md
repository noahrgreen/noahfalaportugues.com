# Reel Draft Build (On-Camera Required)

These reel drafts are configured for Noah on-camera footage.

## Required Inputs
- `reel01_noah_take.mp4` (vertical 9:16 preferred)
- `reel02_noah_take.mp4` (vertical 9:16 preferred)

Place both files in:
- `instagram/batch_002/reels_v3/input/`

## Draft Output Targets
- `instagram/batch_002/reels_v3/output/REEL_01_RealPhrase_DRAFT.mp4`
- `instagram/batch_002/reels_v3/output/REEL_02_BJJPhrase_DRAFT.mp4`

## Build Commands
From repo root:

```bash
mkdir -p instagram/batch_002/reels_v3/input instagram/batch_002/reels_v3/output

ffmpeg -y -i instagram/batch_002/reels_v3/input/reel01_noah_take.mp4 \
  -vf "scale=1080:1920:force_original_aspect_ratio=cover,subtitles=instagram/batch_002/reels_v3/REEL_01_RealPhrase_subtitles.srt:force_style='FontName=Arial,FontSize=14,PrimaryColour=&Hffffff&,OutlineColour=&H101010&,BorderStyle=1,Outline=2,Shadow=0,MarginV=120'" \
  -c:a copy instagram/batch_002/reels_v3/output/REEL_01_RealPhrase_DRAFT.mp4

ffmpeg -y -i instagram/batch_002/reels_v3/input/reel02_noah_take.mp4 \
  -vf "scale=1080:1920:force_original_aspect_ratio=cover,subtitles=instagram/batch_002/reels_v3/REEL_02_BJJPhrase_subtitles.srt:force_style='FontName=Arial,FontSize=14,PrimaryColour=&Hffffff&,OutlineColour=&H101010&,BorderStyle=1,Outline=2,Shadow=0,MarginV=120'" \
  -c:a copy instagram/batch_002/reels_v3/output/REEL_02_BJJPhrase_DRAFT.mp4
```

## Note
Noah on-camera footage is mandatory for these final reel drafts.
