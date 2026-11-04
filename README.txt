Pitch Trainer Mobile v18.4 — added Absolute Pitch assessment mode

Based on the complete preceding v18.3 / v2.2.3 source archive, with no refactoring.
The Mode selector now offers a third, strictly optional Absolute pitch mode alongside
unchanged Single note and Two notes. Default Mode remains Single note.

Absolute pitch mode:
- 12 or 20 questions per round; 5s default limit, optional 2s or untimed.
- Only one isolated note is sounded per question; no reference/replay/correct-note audio.
- A minimum 24-semitone From/To span is required. Consecutive targets differ by
  >12 semitones AND by pitch class; target generation uses finite eligible pools.
- Answer via one of 12 note-name buttons, ignoring octave to test pitch chroma.
- Suppress correctness, pitch-name and staff feedback until the full round ends.
  Do not play instrument keys in this mode, since that would give a reference pitch.
- Next remains a manual action after an answer or timeout. On finishing, show
  per-question answers and total score; Stop Test cancels the round.
- Demo starts/restores the previous mode, settings, and current test state.
- All six interface languages and independent Service Worker cache versions are updated.

Original Single note, Two notes, unrestricted free playing, demo-score.js events,
0.7s ordinary single-note audio, interval 0.6s/0.9s audio and held-key timing
are preserved. This mode reduces reliance on relative-pitch strategies but cannot
prove that all relative-pitch strategies have been eliminated.

To deploy, extract this version's _site.zip and upload its NINE site files to the
EXISTING appropriate Cloudflare Worker, with index.html at the root.
Never upload the piano ZIP to the violin Worker, or vice versa.

Evidence: Wong et al. (2025), Psychonomic Bulletin & Review,
DOI: 10.3758/s13423-024-02620-2. The paper includes restricted-feedback
assessment, octave-spanning adjacent test tones, chroma generalization and
response time windows. Our implementation is not a reproduction of their full
8-week training curriculum.

--- Previous release notes ---

Pitch Trainer Mobile v18.3 — Two notes: minimum/maximum interval and target direction

New in this release:
- Min interval: 1–24 semitones (default 1); Max interval unchanged: 1–24 or Unlimited (default Unlimited).
- Target direction: Higher, Lower, or Both (random; default Both).
- Both reference and target remain inside From/To and respect the chosen interval limits.
- Reject impossible combinations and settings that yield only one target pitch (non-repeat rule).
- Two-note settings are isolated from Single note and restored after Demo, including pending form edits.
- No changes to either music Demo, 0.7s listening tone, or free-play timing.

New release: 18.2 — non-repeating targets and user-selectable maximum two-note interval

Based on the user-provided 18.1 source package. All original demo-score.js events and demo audio
scheduling remain unchanged. The ordinary 0.7-second single-note audition remains unchanged.

- Single note: each new quiz target excludes the previous real quiz target (exact MIDI pitch).
- Two notes: the target likewise never equals the previous real quiz target. The two pitches
  must be different and must both lie inside the original From/To range.
- Two notes: Max interval select offers Unlimited (default) or any 1–24 semitones.
  A numeric limit applies to the absolute semitone distance, up or down.
- At least two pitches in From/To are required for any quiz, otherwise a translated error
  appears at Apply. This avoids impossible no-repeat single-pitch quiz ranges.
- Next, not a timer, advances to the next question. The previous real target remains
  remembered over Stop/Apply; the prerecorded scripted Demo does not alter it.
- The new setting is applied by pressing Apply; its selector is visible only when the
  form's Mode is Two notes. The Demo snapshot restores both applied and un-applied settings.
- Piano and Violin are separate PWAs, with separate caches and upload destinations.

Cloudflare Worker static assets: use the _site.zip, extract its nine website files
into the EXISTING respective Worker and Deploy. Do not overwrite the other app.

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

Absolute-pitch assessment mode: 12/20-trial batches; feedback only after the round;
>12 semitone adjacent jumps; 12 chroma answers across octaves; optional 5s/2s/untimed.
Existing Single / Two notes / Demo are unchanged except for mode integration.
