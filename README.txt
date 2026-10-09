Pitch Trainer Mobile v15

Change since v14:
- Extend Die Forelle vocal melody (without accompaniment) from the pickup
  in original measure 6 through the completion of measure 26.
- The complete 75-note excerpt is transcribed directly from the original MIDI,
  preserving every pitch, note-on time and note-off time.
- The last note is Db5 in measure 26; it sounds for one quarter note, followed
  by one quarter-note rest. The next pickup into measure 27 is not played.
- Approximately 24.3 seconds of music at the unchanged 100 BPM.
- The existing v14 phone UI, tests, languages, octave following, piano sample,
  and Demo state restoration are unchanged.
- Version number and service worker cache bumped to v15 so the new score is loaded.

Update an existing GitHub Pages / Cloudflare Workers static site:
Upload app.js, demo-score.js, and service-worker.js to the site root,
replacing the same-named files. If hosting with Cloudflare Workers static
asset upload, re-deploy the entire site from this ZIP instead.

MIDI source, as published by Mutopia (mirror):
https://github.com/SMUGSterling/FretFree/blob/main/scores/mutopia-502/original.mid
MIDI Git blob SHA: c2127b69737868a82f7337d37835da142ba8f34c

Verification data: tools/original_midi_excerpt.json contains all 75 original
pitch/onset/offset triples; tools/test_score.js checks the deployed score data.
For an independent binary MIDI comparison, obtain the original MIDI and run:
  python tools/verify_against_midi.py path/to/original.mid
This requires the third-party mido Python package.

Local checks:
  node --check app.js
  node --check demo-score.js
  node tools/test_score.js
  node tools/test_translations.js
  python tools/test_mobile_v15.py
  python tools/test_octave_visibility.py
