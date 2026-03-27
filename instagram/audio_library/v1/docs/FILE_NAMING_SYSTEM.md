# NFP Music Library — File Naming System

Pattern:
NFP_TRK_<NNN>_<style>_<tag1>_<tag2>_<duration>s.<ext>

Examples:
- NFP_TRK_001_brazilian_ambient_calm_conversational_60s.mp3
- NFP_TRK_004_bjj_pulse_bjj_conversational_60s.wav

Rules:
1. `NNN` is zero-padded sequential id.
2. `style` is a stable category (brazilian_ambient, study_lofi, neutral_background, bjj_pulse).
3. Use 2-3 tags from: calm, bjj, study, conversational.
4. Duration is in whole seconds.
5. Export both `.wav` (master) and `.mp3` (distribution).
