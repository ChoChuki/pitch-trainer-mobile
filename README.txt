Pitch Trainer Mobile v18.1 — shorter single-note playback

Based exactly on the user-supplied v18 source ZIP (first stanza of Die Forelle, 59 original MIDI events).

Only change in audio behaviour:
- PLAY_DURATION for ordinary single-note test playback, reference-note audition and answering/free tap after a quiz is 0.7s (previously 1.4s).
- Two-note quiz sequence remains reference 0.6s, then target 0.9s at +0.8s.
- Free-play keys still sustain while held and release on pointer up.
- Demo performance uses its own MIDI event durations, which are unchanged.

Other code changes: update APP_VERSION and service-worker CACHE_NAME so browsers can load the latest code.

Deployment to EXISTING Cloudflare Worker:
1. Unzip Pitch_Trainer_Mobile_v18_1_site.zip.
2. Upload its nine website files at the root of the current Pitch Trainer Worker (not the Violin Worker).
3. Deploy. The URL is unchanged. Reopen/reload the app to activate the new service worker.

The _update.zip contains app.js and service-worker.js only.
The full _source.zip includes tests and the original MIDI verification reference.

Original v18 readme preserved below for reference:

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
