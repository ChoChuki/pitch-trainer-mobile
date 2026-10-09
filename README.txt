Pitch Trainer Mobile v17 — Clearer two-note relative-pitch feedback

Changes since v16:
- Keep the original answer method: hear a reference and target, tap the target key.
- Mark the known reference key in blue. Tapping this key during an unanswered
  question replays the reference without marking an answer incorrect.
- Automatically show the reference octave; show the correct target octave
  after answering if the correct key is offscreen.
- After answering, replay reference -> target, show both notes on the staff,
  and let the staff replay both notes again.
- Feedback compares your signed semitone distance to the correct distance.
- Shorten the six-language instruction text, including Traditional Chinese
  "兩音" rather than the simultaneous-note term "雙音".
- No new settings or upward-only mode; keep the original mixed question pool.
- Retain the exact original 75-note Forelle event data and music playback.
- Bump the PWA cache name to v17.

v16 background:
- Added Mode selector: Single note (default, original behavior) or Two notes.
- Two notes: show and play a reference pitch, then play a target pitch.
  Tap the target pitch on the piano keyboard to answer.
  The target is different from the reference, at most 12 semitones away,
  and both notes stay inside the selected From/To pitch range.
- Tap the staff during an unanswered Two notes question to hear both notes again.
- After answering, show the reference -> target names and semitone distance.
- Demo now briefly demonstrates Two notes (F4 -> A4), between the existing
  single-note quiz and the unchanged 75-note Schubert Die Forelle performance.
- All six user interface languages updated: en, de, ja, it, el, zh-TW.
- The settings, staff and keyboard still fit on one phone screen.
- The existing octave navigation and dynamic C4/C5 switching are unchanged.
- Preserve original applied settings, pending form entries, test state and
  scroll position after finishing or stopping Demo.
- Reused exactly the same 75-note original-MIDI melody from v15.
- Upgraded PWA service worker cache name to v17 to load revised assets.

How to use:
1. Choose Mode -> Two notes, click Apply.
2. Click Play. Reference pitch is shown on the staff and outlined blue on keyboard.
3. Listen to the second note. Tap its piano key as your answer.
4. Tap the blue reference key to hear only that reference again without scoring.
5. Tap the staff at any time during the question, including after answering,
   to hear both notes again. Feedback shows signed semitone distances.
6. Click Next for another question, or Stop Test to return to free play.
7. In Single note mode, the original single-tone test works as before.

How to update:
- Cloudflare Workers static upload: unzip v17_site.zip and deploy all nine
  website files (index.html must be at the upload root) to your current Worker.
  Keep the same Worker to preserve the public web address.
- GitHub Pages: replace the five files in v17_update.zip at the site root.
- v17.zip contains the complete site and the optional test scripts.

Original melody source:
https://github.com/SMUGSterling/FretFree/blob/main/scores/mutopia-502/original.mid
MIDI Git blob SHA: c2127b69737868a82f7337d37835da142ba8f34c

Local verification:
  node --check app.js
  node --check i18n.js
  node tools/test_score.js
  node tools/test_translations.js
  python tools/test_mobile_v17.py

Automated tests use mocked audio in headless Chromium; final listening on
real phone and published Cloudflare website is not yet verified.
