# Music Inbox (Noah -> System)

Drop Suno-exported audio files here.

## Required Handoff Inputs
1. Audio file (`.mp3` or `.wav`)
2. Metadata row in `inbox_manifest.csv` with:
   - source_file
   - category (`brazil_ambient|study_lofi|cinematic|bjj`)
   - mood
   - tempo_bpm
   - use_case
   - prompt_version
   - notes
3. Keep fields simple CSV text (avoid commas inside values; use semicolons if needed).

## Naming (temporary in inbox)
`inbox_<date>_<shortname>.mp3`

Example:
`inbox_2026-03-23_brazil_ambient_take03.mp3`

## Processing
After ingest, CS will:
1. verify no vocals
2. normalize level for voice-safe usage
3. assign final library filename
4. move final file into category folder
5. update `music/docs/TRACK_METADATA.csv`
6. deduplicate by audio hash to prevent repeat imports

Run check without writing:
`/Users/noahgreen/NGO/noahfalaportugues.com/music/scripts/ingest_inbox.sh --dry-run`
