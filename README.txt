Pitch Trainer Mobile v13

Changes from v12:
- The UI has three buttons on one row: Play (toggles to Stop Test), Next, Demo.
- The Replay button has been removed; the Stop Test action still exists via Play.
- Mobile screen height reduced without changing the default settings or training logic.
- Piano white keys resize slightly to fit C through B within the available viewport.
- Demo follows the currently sounding melody note to choose the correct octave.
- Die Forelle demo is now just the first part: verified MIDI melody,
  original pickup bar 6 to tonic Db5 at bar 18 (first dotted quarter).
  The following upbeat note is omitted so the excerpt ends with a rest.
- Tempo, pitches, durations and rests of retained MIDI notes are unchanged.
- Demo still restores the original state when finished or cancelled.

Deploy:
Upload index.html, styles.css, app.js, demo-score.js and service-worker.js
to the same root of the GitHub Pages repository. Keep other files unchanged.

Check:
node --check app.js && node --check demo-score.js
python tools/verify_against_midi.py path/to/original.mid
