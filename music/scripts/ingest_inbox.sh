#!/usr/bin/env bash
set -euo pipefail

ROOT="/Users/noahgreen/NGO/noahfalaportugues.com/music"
INBOX="$ROOT/inbox"
PROCESSED="$ROOT/processed"
MASTERS="$ROOT/_masters"
DOCS="$ROOT/docs"
MANIFEST="$INBOX/inbox_manifest.csv"
META="$DOCS/TRACK_METADATA.csv"
TECH="$DOCS/TRACK_TECHNICAL_SPECS.csv"
INGEST_LOG="$DOCS/INGEST_LOG.csv"

mkdir -p "$PROCESSED" "$MASTERS" "$DOCS"

if [[ ! -f "$MANIFEST" ]]; then
  echo "Missing manifest: $MANIFEST" >&2
  exit 1
fi

if [[ ! -f "$INGEST_LOG" ]]; then
  echo "ingested_at,source_file,category,output_file,prompt_version,status,notes" > "$INGEST_LOG"
fi

if [[ ! -f "$META" ]]; then
  echo "track_file,category,mood,tempo_bpm,use_case,voice_mix_percent,mix_guidance" > "$META"
fi

sanitize_csv() {
  local s="${1:-}"
  s="${s//$'\r'/}"
  s="${s//,/;}"
  printf '%s' "$s"
}

next_index() {
  local category="$1"
  local prefix="$ROOT/$category/${category}_"
  local max=0
  local f bn num
  shopt -s nullglob
  for f in "${prefix}"*.mp3; do
    bn="$(basename "$f")"
    num="$(echo "$bn" | sed -E "s/^${category}_([0-9]{2})\.mp3$/\1/")"
    if [[ "$num" =~ ^[0-9]{2}$ ]]; then
      if ((10#$num > max)); then
        max=$((10#$num))
      fi
    fi
  done
  shopt -u nullglob
  printf '%02d' "$((max + 1))"
}

append_tech_row() {
  local file="$1"
  local category="$2"
  local stream dur codec sr ch
  stream="$(ffprobe -v error -select_streams a:0 -show_entries stream=codec_name,sample_rate,channels -of csv=p=0 "$file")"
  dur="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$file")"
  codec="$(echo "$stream" | cut -d',' -f1)"
  sr="$(echo "$stream" | cut -d',' -f2)"
  ch="$(echo "$stream" | cut -d',' -f3)"
  printf '%s,%s,%.2f,%s,%s,%s\n' "$(basename "$file")" "$category" "$dur" "$sr" "$ch" "$codec" >> "$TECH"
}

if [[ ! -f "$TECH" ]]; then
  echo "track_file,category,duration_sec,sample_rate,channels,codec" > "$TECH"
fi

processed_count=0
skipped_count=0

# Expecting header:
# source_file,category,mood,tempo_bpm,use_case,prompt_version,notes
while IFS=',' read -r source_file category mood tempo_bpm use_case prompt_version notes; do
  source_file="$(sanitize_csv "$source_file")"
  category="$(sanitize_csv "$category")"
  mood="$(sanitize_csv "$mood")"
  tempo_bpm="$(sanitize_csv "$tempo_bpm")"
  use_case="$(sanitize_csv "$use_case")"
  prompt_version="$(sanitize_csv "$prompt_version")"
  notes="$(sanitize_csv "$notes")"

  if [[ -z "$source_file" ]]; then
    continue
  fi
  if [[ "${source_file:0:1}" == "#" ]]; then
    continue
  fi

  if [[ "$category" != "brazil_ambient" && "$category" != "study_lofi" && "$category" != "cinematic" && "$category" != "bjj" ]]; then
    echo "Skipping $source_file: invalid category '$category'"
    skipped_count=$((skipped_count + 1))
    continue
  fi

  src="$INBOX/$source_file"
  if [[ ! -f "$src" ]]; then
    echo "Skipping $source_file: file not found in inbox"
    skipped_count=$((skipped_count + 1))
    continue
  fi

  idx="$(next_index "$category")"
  out_mp3="$ROOT/$category/${category}_${idx}.mp3"
  out_wav="$MASTERS/${category}_${idx}.wav"

  ffmpeg -y -i "$src" -vn -ar 48000 -ac 2 -codec:a libmp3lame -b:a 192k "$out_mp3" >/dev/null 2>&1
  ffmpeg -y -i "$src" -vn -ar 48000 -ac 2 "$out_wav" >/dev/null 2>&1

  # Add metadata row (CSV-safe; commas sanitized to semicolons)
  printf '%s,%s,%s,%s,%s,%s,%s\n' \
    "$(basename "$out_mp3")" \
    "$category" \
    "$mood" \
    "$tempo_bpm" \
    "$use_case" \
    "12" \
    "${notes:-ingested_from_inbox} [${prompt_version:-prompt_na}]" \
    >> "$META"

  append_tech_row "$out_mp3" "$category"

  ingested_at="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  printf '%s,%s,%s,%s,%s,%s,%s\n' \
    "$ingested_at" \
    "$source_file" \
    "$category" \
    "$(basename "$out_mp3")" \
    "${prompt_version:-prompt_na}" \
    "INGESTED" \
    "${notes:-ok}" \
    >> "$INGEST_LOG"

  mv "$src" "$PROCESSED/${ingested_at//[:]/-}_$source_file"
  processed_count=$((processed_count + 1))
  echo "Ingested: $source_file -> $(basename "$out_mp3")"
done < <(tail -n +2 "$MANIFEST" || true)

echo "Done. processed=$processed_count skipped=$skipped_count"
