#!/usr/bin/env bash
set -euo pipefail

ROOT="/Users/noahgreen/NGO/noahfalaportugues.com/music"
DOCS="$ROOT/docs"
INBOX="$ROOT/inbox"
MANIFEST="$INBOX/inbox_manifest.csv"
LOG="$DOCS/INGEST_LOG.csv"

count_tracks() {
  local cat="$1"
  local n
  n=$(find "$ROOT/$cat" -maxdepth 1 -type f -name "*.mp3" | wc -l | tr -d ' ')
  echo "$n"
}

echo "Music Library Status"
echo "--------------------"
printf "brazil_ambient: %s\n" "$(count_tracks brazil_ambient)"
printf "study_lofi:     %s\n" "$(count_tracks study_lofi)"
printf "cinematic:      %s\n" "$(count_tracks cinematic)"
printf "bjj:            %s\n" "$(count_tracks bjj)"

echo
if [[ -f "$MANIFEST" ]]; then
  pending=$(( $(wc -l < "$MANIFEST") - 1 ))
  if (( pending < 0 )); then pending=0; fi
  printf "Pending manifest rows: %s\n" "$pending"
else
  echo "Pending manifest rows: 0"
fi

inbox_files=$(find "$INBOX" -maxdepth 1 -type f \( -name '*.mp3' -o -name '*.wav' -o -name '*.m4a' -o -name '*.flac' \) | wc -l | tr -d ' ')
printf "Inbox audio files:     %s\n" "$inbox_files"

if [[ -f "$LOG" ]]; then
  ingested=$(( $(wc -l < "$LOG") - 1 ))
  if (( ingested < 0 )); then ingested=0; fi
  printf "Total ingested:        %s\n" "$ingested"
fi

echo
if [[ -f "$LOG" ]]; then
  echo "Last 5 ingest events:"
  tail -n 5 "$LOG"
fi
