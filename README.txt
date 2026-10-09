Pitch Trainer Mobile v11

What's changed from v10
- Demo restores the applied settings, any un-applied selector edits, note/staff
  display, keyboard scroll position and page scroll, both after completion and
  cancellation. The music title is never left on the idle screen.
- Demo now plays a short Schubert Die Forelle vocal excerpt and the right-hand
  notes transcribed from the Mutopia public-domain LilyPond score.
- Demo music is stored in demo-score.js with source bar/tick metadata.
- Multi-note duplicates from voice + accompaniment are de-duplicated.
- Staff layout is determined by selected note range, not pressed notes.
- Demo stop is immediate; normal buttons do not appear disabled in Demo.
- Free-play key release is individually handled via WebAudioFont envelopes.
- Service worker cache version bumped and cache installation bypasses HTTP cache.

Music source
https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=502
Generated via tools/build_demo_score.py (a manual transcription from LilyPond).
MIDI cross-verification of the transcription is NOT included in the runtime,
and has NOT been completed in this release. Do not claim it has been completed.

GitHub Pages
Upload these 6 files to the repository root, replacing existing files:
    app.js
    demo-score.js (new)
    i18n.js
    index.html
    styles.css
    service-worker.js
No external app libraries have changed; existing icons/manifest stay the same.
Refresh the GitHub Pages page after deployment, then reopen installed PWA.

Local test
    python -m http.server 8000
Open http://localhost:8000
