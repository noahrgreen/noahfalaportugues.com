# Reel Build Instructions (Batch 003)

Required inputs (Noah on camera):
- reels/input/reel01_noah_take.mp4
- reels/input/reel02_noah_take.mp4

Outputs:
- reels/output/B003_REEL01_DRAFT.mp4
- reels/output/B003_REEL02_DRAFT.mp4

Commands:
```bash
mkdir -p instagram/batch_003/reels/input instagram/batch_003/reels/output

ffmpeg -y -i instagram/batch_003/reels/input/reel01_noah_take.mp4 \
  -vf "scale=1080:1920:force_original_aspect_ratio=cover,subtitles=instagram/batch_003/reels/REEL_01_subtitles.srt:force_style='FontName=Arial,FontSize=14,PrimaryColour=&Hffffff&,OutlineColour=&H101010&,BorderStyle=1,Outline=2,Shadow=0,MarginV=120'" \
  -c:a copy instagram/batch_003/reels/output/B003_REEL01_DRAFT.mp4

ffmpeg -y -i instagram/batch_003/reels/input/reel02_noah_take.mp4 \
  -vf "scale=1080:1920:force_original_aspect_ratio=cover,subtitles=instagram/batch_003/reels/REEL_02_subtitles.srt:force_style='FontName=Arial,FontSize=14,PrimaryColour=&Hffffff&,OutlineColour=&H101010&,BorderStyle=1,Outline=2,Shadow=0,MarginV=120'" \
  -c:a copy instagram/batch_003/reels/output/B003_REEL02_DRAFT.mp4
```
