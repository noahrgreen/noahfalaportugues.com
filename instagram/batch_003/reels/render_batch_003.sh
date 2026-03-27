#!/usr/bin/env bash
set -euo pipefail

BASE="/Users/noahgreen/NGO/noahfalaportugues.com/instagram/batch_003/reels"
IN="$BASE/input"
OUT="$BASE/output"
REV="/Users/noahgreen/NGO/noahfalaportugues.com/instagram/batch_003/review"
MUSIC="/Users/noahgreen/NGO/noahfalaportugues.com/music"

R1_IN="$IN/reel01_noah_take.mp4"
R2_IN="$IN/reel02_noah_take.mp4"

R1_SUB="$REV/REEL_01_subtitles.srt"
R2_SUB="$REV/REEL_02_subtitles.srt"

R1_MUS="$MUSIC/brazil_ambient/brazil_ambient_01.mp3"
R2_MUS="$MUSIC/bjj/bjj_01.mp3"

R1_OUT="$OUT/B003_REEL01_RealPhrase_DRAFT.mp4"
R2_OUT="$OUT/B003_REEL02_BJJ_DRAFT.mp4"

mkdir -p "$IN" "$OUT"

for f in "$R1_IN" "$R2_IN" "$R1_SUB" "$R2_SUB" "$R1_MUS" "$R2_MUS"; do
  if [[ ! -f "$f" ]]; then
    echo "Missing required file: $f" >&2
    exit 1
  fi
done

# Reel 1: music at ~ -24 dB under voice (volume factor 0.063)
ffmpeg -y \
  -i "$R1_IN" \
  -stream_loop -1 -i "$R1_MUS" \
  -filter_complex "[0:a]volume=1.0[voice];[1:a]volume=0.063[music];[voice][music]amix=inputs=2:duration=first:dropout_transition=2[mix];[0:v]scale=1080:1920:force_original_aspect_ratio=cover,crop=1080:1920,subtitles='$R1_SUB':force_style='FontName=Arial,FontSize=14,PrimaryColour=&Hffffff&,OutlineColour=&H101010&,BorderStyle=1,Outline=2,Shadow=0,MarginV=120'[vout]" \
  -map "[vout]" -map "[mix]" \
  -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -ar 48000 \
  "$R1_OUT"

# Reel 2: music at ~ -23 dB under voice (volume factor 0.071)
ffmpeg -y \
  -i "$R2_IN" \
  -stream_loop -1 -i "$R2_MUS" \
  -filter_complex "[0:a]volume=1.0[voice];[1:a]volume=0.071[music];[voice][music]amix=inputs=2:duration=first:dropout_transition=2[mix];[0:v]scale=1080:1920:force_original_aspect_ratio=cover,crop=1080:1920,subtitles='$R2_SUB':force_style='FontName=Arial,FontSize=14,PrimaryColour=&Hffffff&,OutlineColour=&H101010&,BorderStyle=1,Outline=2,Shadow=0,MarginV=120'[vout]" \
  -map "[vout]" -map "[mix]" \
  -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -ar 48000 \
  "$R2_OUT"

echo "Rendered:"
echo "- $R1_OUT"
echo "- $R2_OUT"
