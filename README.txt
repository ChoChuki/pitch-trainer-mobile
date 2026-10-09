Pitch Trainer Mobile v14

Only changes since v13:
- Demo ends on the authentic bar-14 Ab4 cadence, rather than beginning the next
  incomplete musical/lyrical sentence (bars 15-18).
- The last note is the original-MIDI Ab4 quarter note, and the rest of bar 14 is
  silent (one quarter). The pickup Ab4 into bar 15 is intentionally omitted.
- 29 exact MIDI melody events instead of 46, lasting about 10 seconds at 100 BPM.
- No new notes, accompaniment, tempo changes, or layout changes.
- Service worker version incremented to force the new demo-score into cache.

Deploy (update only):
Upload app.js, demo-score.js and service-worker.js to the existing GitHub
Pages repository root, replacing same-named files. Other files stay unchanged.

Independent MIDI source:
https://github.com/SMUGSterling/FretFree/blob/main/scores/mutopia-502/original.mid
The local tools/original_midi_excerpt.json stores exact pitch/onset/offset
triples for the 29 notes.

Checks:
node --check app.js
node --check demo-score.js
node tools/test_score.js
python tools/verify_against_midi.py /path/to/original.mid
(The last check needs an original MIDI file; it is not required at runtime.)
