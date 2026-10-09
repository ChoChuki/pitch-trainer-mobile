Pitch Trainer Mobile v12

Demo music
- Schubert: Die Forelle, D.550, public-domain original MIDI vocal track.
- Original MIDI source: https://github.com/SMUGSterling/FretFree/blob/main/scores/mutopia-502/original.mid
- Git blob SHA: c2127b69737868a82f7337d37835da142ba8f34c
- Public-domain score reference: https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=502
- Measures: pickup in bar 6 through bar 26 (inclusive), melody ONLY, no accompaniment.
- Exact extracted MIDI pitches and relative tick positions in demo-score.js.
- v11 opening 29 melody events have been checked against original MIDI extraction.
- Ending: bar 26 Db5 quarter note then a quarter rest (not a cut-off mid-phrase).
- Demo playing speed: 100 quarter notes/minute; notation remains unchanged.
- The music playback lasts about 24 seconds. Total walkthrough is longer.

Deploy via GitHub Pages
- Upload app.js, demo-score.js, service-worker.js to repository root.
- Leave all other v11 files unchanged.
- Reload the website after deployment and reopen the PWA.

Independent reference verification
- Source MIDI reference data is stored at tools/original_midi_excerpt.json.
- Run: python tools/verify_against_midi.py [path/to/original.mid]
- Without a supplied MIDI path, the checker downloads the source MIDI from
  the upstream Mutopia URL. This network-dependent test may require internet.
- Use: node tools/test_score.js to run local structural checks.
