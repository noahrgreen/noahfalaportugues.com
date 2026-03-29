# Noah Fala Português — Music System

Purpose: controlled, reusable, brand-aligned audio for reels and video content.

Core principle:
Audio supports identity, consistency, and quality. It never overpowers voice.

## Categories
- `brazil_ambient/`
- `study_lofi/`
- `cinematic/`
- `bjj/`

## Current Library (v1)
- `brazil_ambient_01.mp3`
- `brazil_ambient_02.mp3`
- `study_lofi_01.mp3`
- `study_lofi_02.mp3`
- `cinematic_01.mp3`
- `bjj_01.mp3`

Masters are stored in `_masters/` as WAV.

## Operating Defaults
1. Reels default to this internal library.
2. IG native music is optional experiment only.
3. Voice is 100%; music target is 10-20% (roughly -24 dB to -20 dB under voice).
4. No vocals, no lyrics, no aggressive drums.
5. CS does not access Suno directly; Noah generates and drops exports in `music/inbox/`.

See `docs/` for prompts, metadata, QA, and content mapping.

## Fast Ops Commands
- Queue a new Suno export:
  `music/scripts/queue_inbox.sh <audio_path> <category> <mood> <tempo_bpm> <use_case> <prompt_version> [notes]`
- Dry-run ingest validation:
  `music/scripts/ingest_inbox.sh --dry-run`
- Ingest one file:
  `music/scripts/ingest_inbox.sh --only <source_file>`
- Status snapshot:
  `music/scripts/library_status.sh`
