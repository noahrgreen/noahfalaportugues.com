#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/tracks"
mkdir -p "$OUT"

ffmpeg -y -f lavfi -t 60 -i "sine=frequency=110:sample_rate=48000" \
  -f lavfi -t 60 -i "sine=frequency=220:sample_rate=48000" \
  -f lavfi -t 60 -i "anoisesrc=color=pink:sample_rate=48000" \
  -filter_complex "[0:a]volume=0.09[a0];[1:a]volume=0.05[a1];[2:a]volume=0.014,lowpass=f=1200[a2];[a0][a1][a2]amix=inputs=3:normalize=0,alimiter=limit=0.85" \
  -ar 48000 -ac 2 "$OUT/NFP_TRK_001_brazilian_ambient_calm_conversational_60s.wav"

ffmpeg -y -f lavfi -t 75 -i "sine=frequency=165:sample_rate=48000" \
  -f lavfi -t 75 -i "sine=frequency=330:sample_rate=48000" \
  -f lavfi -t 75 -i "aevalsrc=0.22*exp(-45*mod(t\\,0.5))*sin(2*PI*55*t):s=48000" \
  -f lavfi -t 75 -i "anoisesrc=color=pink:sample_rate=48000" \
  -filter_complex "[0:a]volume=0.06[a0];[1:a]volume=0.03[a1];[2:a]lowpass=f=180[a2];[3:a]volume=0.008,lowpass=f=1500[a3];[a0][a1][a2][a3]amix=inputs=4:normalize=0,alimiter=limit=0.85" \
  -ar 48000 -ac 2 "$OUT/NFP_TRK_002_study_lofi_study_calm_75s.wav"

ffmpeg -y -f lavfi -t 45 -i "sine=frequency=196:sample_rate=48000" \
  -f lavfi -t 45 -i "sine=frequency=294:sample_rate=48000" \
  -f lavfi -t 45 -i "sine=frequency=392:sample_rate=48000" \
  -filter_complex "[0:a]volume=0.05[a0];[1:a]volume=0.03[a1];[2:a]volume=0.02[a2];[a0][a1][a2]amix=inputs=3:normalize=0,alimiter=limit=0.85" \
  -ar 48000 -ac 2 "$OUT/NFP_TRK_003_neutral_background_conversational_calm_45s.wav"

ffmpeg -y -f lavfi -t 60 -i "sine=frequency=98:sample_rate=48000" \
  -f lavfi -t 60 -i "sine=frequency=147:sample_rate=48000" \
  -f lavfi -t 60 -i "aevalsrc=0.18*exp(-55*mod(t\\,0.4))*sin(2*PI*73*t):s=48000" \
  -f lavfi -t 60 -i "anoisesrc=color=white:sample_rate=48000" \
  -filter_complex "[0:a]volume=0.07[a0];[1:a]volume=0.03[a1];[2:a]lowpass=f=220[a2];[3:a]volume=0.004,lowpass=f=900[a3];[a0][a1][a2][a3]amix=inputs=4:normalize=0,alimiter=limit=0.85" \
  -ar 48000 -ac 2 "$OUT/NFP_TRK_004_bjj_pulse_bjj_conversational_60s.wav"

ffmpeg -y -f lavfi -t 90 -i "sine=frequency=132:sample_rate=48000" \
  -f lavfi -t 90 -i "sine=frequency=264:sample_rate=48000" \
  -f lavfi -t 90 -i "anoisesrc=color=pink:sample_rate=48000" \
  -filter_complex "[0:a]volume=0.07[a0];[1:a]volume=0.03[a1];[2:a]volume=0.010,lowpass=f=1000[a2];[a0][a1][a2]amix=inputs=3:normalize=0,alimiter=limit=0.85" \
  -ar 48000 -ac 2 "$OUT/NFP_TRK_005_study_neutral_calm_study_90s.wav"

for f in "$OUT"/*.wav; do
  ffmpeg -y -i "$f" -codec:a libmp3lame -b:a 192k "${f%.wav}.mp3" >/dev/null 2>&1
done

echo "Generated tracks in: $OUT"
