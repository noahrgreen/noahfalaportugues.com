# Inbox Ingest Workflow

## Handoff Model
1. COO-MUSIC defines prompt/spec/category.
2. Noah generates in Suno and exports audio.
3. Noah places files in `music/inbox/` and fills `inbox_manifest.csv`.
4. CS runs ingest script to process and promote tracks.

## Command
```bash
/Users/noahgreen/NGO/noahfalaportugues.com/music/scripts/ingest_inbox.sh
```

Dry-run:
```bash
/Users/noahgreen/NGO/noahfalaportugues.com/music/scripts/ingest_inbox.sh --dry-run
```

Single-file ingest:
```bash
/Users/noahgreen/NGO/noahfalaportugues.com/music/scripts/ingest_inbox.sh --only <source_file>
```

## Script Actions
1. Validates category and source-file existence.
2. Converts source to:
   - category mp3 (192 kbps, 48kHz stereo)
   - master wav (48kHz stereo)
   - applies loudness normalization for voice-safe playback
3. Assigns next sequential filename per category.
4. Appends metadata and technical specs.
5. Deduplicates by SHA-256 hash.
6. Writes ingest log + hash log.
7. Moves source file to `music/processed/`.

## Required Manifest Header
`source_file,category,mood,tempo_bpm,use_case,prompt_version,notes`

## Queue Helper
Use this to add files to inbox + manifest in one step:
```bash
/Users/noahgreen/NGO/noahfalaportugues.com/music/scripts/queue_inbox.sh <audio_path> <category> <mood> <tempo_bpm> <use_case> <prompt_version> [notes]
```
