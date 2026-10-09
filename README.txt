Pitch Trainer Mobile v18 — First stanza (four two-line groups) of Die Forelle

This v18 REPLACES the previously withdrawn v18 46-note ZIPs.

Exactly first stanza of Schubert's Die Forelle once:
1. In einem Bächlein helle / Da schoß in froher Eil
2. Die launische Forelle / Vorüber wie ein Pfeil
3. Ich stand an dem Gestade / Und sah in süßer Ruh
4. Des muntern Fischleins Bade / Im klaren Bächlein zu

The original score repeats the last TWO lines (Des muntern...Im klaren...).
That repeated couplet is omitted by stopping after the first 'zu' in bar 22.
- Original Mutopia MIDI melody, bars 6 pickup through bar 22, first 'zu'.
- 59 note events, pitches/rhythms/timings match original exactly.
- 100 BPM, 19.2 seconds of notes, 1 final beat of rest (~19.8 seconds).
- No invented notes or accompaniment.
- Original Demo audio engine, octave navigation, and UI left untouched.

Training modes and six interface languages remain exactly as in v17,
including the improved relative-pitch reference feedback.

Only changed deployed website files:
- demo-score.js (59 original MIDI notes; first stanza without repeat)
- app.js (one explanatory comment only; functional code untouched)
- service-worker.js (cache name v18)
All other website assets are byte-for-byte the same as v17.

Cloudflare: unzip v18_site.zip and upload its NINE files to the EXISTING Worker.
GitHub Pages: overwrite the three files in v18_update.zip.
Full v18.zip also contains optional tests, README and MIDI reference data.

Source: https://github.com/SMUGSterling/FretFree/blob/main/scores/mutopia-502/original.mid
LilyPond lyric and melody sheet: https://github.com/MutopiaProject/MutopiaProject/tree/master/ftp/SchubertF/D550/forelle/forelle-lys
MIDI source git blob: c2127b69737868a82f7337d37835da142ba8f34c

Verification:
  node --check app.js
  node --check demo-score.js
  node tools/test_score.js
  node tools/test_translations.js
  python tools/test_mobile_v18.py
  python tools/test_octave_visibility.py
  python tools/test_feedback_layout.py

Automated browsers use mock audio; real-device listening still needs checking.
