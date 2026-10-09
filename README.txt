PITCH TRAINER MOBILE v6

This archive contains eight website files plus this README.
Upload the eight website files into the root of your existing GitHub
repository, replacing same-name files. Do not upload the ZIP or README.

New in v6:
- Demo uses the NORMAL full-width piano keyboard. No compact demo layout.
- Demo automatically activates the existing C3/C4/C5 octave shortcuts
  during performance. Register changes are visual only: all polyphonic
  notes continue to play, and the entire chord stays on the staff.
- Only notes visible within the scrolled keyboard show touch indicators;
  other sounding notes remain in the synchronized notation.
- Regular octave shortcuts remain unchanged for manual playing.

Retained from v5:
- Octave names on the keyboard and quick-jump buttons.
- 64-bar, about 2 min 8 sec Mozart-themed demonstration arrangement
  of "Non piu andrai" with melody, bass, and chords.
  It is not a literal transcription of the entire original aria.
- Six languages, polyphonic free play, single-note pitch tests.

GitHub Pages update:
1. Open your existing repository on github.com (usually main branch).
2. Choose Add file > Upload files.
3. Upload the eight website files (app.js, i18n.js, index.html,
   styles.css, service-worker.js, manifest.webmanifest, both icons).
4. Commit, wait for Pages to deploy, and reload your site on the phone.
5. If installed PWA still shows the old version, close/reopen and reload
   the site in the browser to pick up the versioned service worker cache.
