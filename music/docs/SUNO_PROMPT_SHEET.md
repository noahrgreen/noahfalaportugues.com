# Suno Prompt Sheet — Noah Fala Português

Use this sheet when generating new music in Suno.

## Global Constraints (all tracks)
- Instrumental only
- No vocals
- No lyrics
- Tempo target: 60-90 BPM
- Length target: 30-90 seconds
- Must loop cleanly
- Background-speech-safe mix (voice-first)

## Output Requirement
Export as `.mp3` or `.wav`, then place files in:
- `music/inbox/`

Add one row per file in:
- `music/inbox/inbox_manifest.csv`

---

## Category A — Brazil Ambient

- Category: `brazil_ambient`
- Song Title: `NFP Brazil Ambient 0X`
- Styles: `instrumental, brazilian-inspired, bossa nova light, acoustic guitar, minimal percussion, warm`
- Weirdness: `20-35`
- Style influence: `85-95`
- Inspo: `Rio atmosphere, calm conversation, cultural context`
- Persona: `Disciplined adult learner, thoughtful and grounded`
- Audio: `No vocals, no lyrics, 68-78 BPM, 45-75s, clean loop, speech-safe`

Prompt block:
"Instrumental Brazilian bossa nova style, soft acoustic guitar, minimal percussion, warm and calm, no vocals, background music for speaking, clean and modern."

---

## Category B — Study / Lo-fi

- Category: `study_lofi`
- Song Title: `NFP Study Lofi 0X`
- Styles: `instrumental, lofi study, soft textures, minimal beat, neutral`
- Weirdness: `15-30`
- Style influence: `90-100`
- Inspo: `SRS review sessions, focused study blocks, repetition`
- Persona: `Structured operator, calm, consistency over intensity`
- Audio: `No vocals, no lyrics, 70-84 BPM, 60-90s, clean loop, low transient peaks`

Prompt block:
"Instrumental lo-fi study beat, minimal drums, soft textures, calm and steady, no vocals, background for educational content."

---

## Category C — Cinematic Light

- Category: `cinematic`
- Song Title: `NFP Cinematic Light 0X`
- Styles: `instrumental, cinematic ambient, soft pads, minimal percussion, reflective`
- Weirdness: `25-40`
- Style influence: `80-92`
- Inspo: `Important messages, thoughtful transitions, reflective tone`
- Persona: `Clear, intentional, composed`
- Audio: `No vocals, no lyrics, 60-74 BPM, 45-90s, clean loop, subtle build`

Prompt block:
"Minimal cinematic ambient instrumental, soft pads, slow progression, calm and reflective, no vocals, background for thoughtful content."

---

## Category D — BJJ Context

- Category: `bjj`
- Song Title: `NFP BJJ Context 0X`
- Styles: `instrumental, minimal rhythm, controlled intensity, tight percussion, focused`
- Weirdness: `18-32`
- Style influence: `88-98`
- Inspo: `Mat coaching cues, controlled pressure, practical training context`
- Persona: `Calm under pressure, direct, practical`
- Audio: `No vocals, no lyrics, 78-90 BPM, 45-75s, clean loop, voice-safe`

Prompt block:
"Instrumental minimal rhythmic background, controlled intensity, tight low percussion, calm and focused energy, no vocals, suitable for Brazilian Jiu-Jitsu context and spoken voice."

---

## Quick Quality Filter (before export)
Reject if any of the following occur:
1. Audible vocal phrases or vocal textures
2. Aggressive drums masking speech
3. Harmonic movement too busy for spoken content
4. Loop clicks or obvious seam
5. Overly hype/trendy feel that breaks brand tone

## Post-Generation Handoff
1. Export selected file(s)
2. Place file(s) in `music/inbox/`
3. Add metadata row(s) to `music/inbox/inbox_manifest.csv`
4. Notify CS to run ingest script
