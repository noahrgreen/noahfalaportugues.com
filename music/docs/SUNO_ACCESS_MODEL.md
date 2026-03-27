# Suno Access Model (Locked)

## Control Separation
1. CS does **not** access Suno directly.
2. COO-MUSIC produces:
   - prompts
   - track specs
   - category assignment
3. Noah performs:
   - Suno generation
   - audio export
4. Noah returns exported files to:
   - `music/inbox/`
5. CS resumes control for:
   - tagging
   - editing/normalization
   - reel integration

## Security Principle
- No Suno credentials in repo
- No credential handling by CS automation
- Files only move through inbox handoff

## Success Standard
- clean separation of control
- no credential exposure
- high-quality output maintained
