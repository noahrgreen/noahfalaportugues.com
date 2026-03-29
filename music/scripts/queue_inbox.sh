#!/usr/bin/env bash
set -euo pipefail

ROOT="/Users/noahgreen/NGO/noahfalaportugues.com/music"
INBOX="$ROOT/inbox"
MANIFEST="$INBOX/inbox_manifest.csv"

usage() {
  cat <<USAGE
Usage:
  queue_inbox.sh <audio_path> <category> <mood> <tempo_bpm> <use_case> <prompt_version> [notes]

Valid categories:
  brazil_ambient | study_lofi | cinematic | bjj
USAGE
}

if [[ $# -lt 6 ]]; then
  usage >&2
  exit 1
fi

src="$1"
category="$2"
mood="$3"
tempo_bpm="$4"
use_case="$5"
prompt_version="$6"
notes="${7:-queued}"

if [[ ! -f "$src" ]]; then
  echo "Audio file not found: $src" >&2
  exit 1
fi

case "$category" in
  brazil_ambient|study_lofi|cinematic|bjj) ;;
  *)
    echo "Invalid category: $category" >&2
    exit 1
    ;;
esac

ext="${src##*.}"
case "$ext" in
  mp3|MP3|wav|WAV|m4a|M4A|flac|FLAC) ;;
  *)
    echo "Unsupported extension: .$ext" >&2
    exit 1
    ;;
esac

mkdir -p "$INBOX"
if [[ ! -f "$MANIFEST" ]]; then
  echo "source_file,category,mood,tempo_bpm,use_case,prompt_version,notes" > "$MANIFEST"
fi

safe() {
  local s="${1:-}"
  s="${s//$'\r'/}"
  s="${s//,/;}"
  printf '%s' "$s"
}

ts="$(date +%Y-%m-%d_%H%M%S)"
base="$(basename "$src")"
out="inbox_${ts}_${base}"

cp "$src" "$INBOX/$out"

printf '%s,%s,%s,%s,%s,%s,%s\n' \
  "$(safe "$out")" \
  "$(safe "$category")" \
  "$(safe "$mood")" \
  "$(safe "$tempo_bpm")" \
  "$(safe "$use_case")" \
  "$(safe "$prompt_version")" \
  "$(safe "$notes")" \
  >> "$MANIFEST"

echo "Queued: $out"
echo "Manifest updated: $MANIFEST"
