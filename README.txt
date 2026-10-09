PITCH TRAINER MOBILE

Files required in the root of your GitHub Pages repository:
index.html
styles.css
app.js
i18n.js
service-worker.js
manifest.webmanifest
icon-192.png
icon-512.png

UPDATING AN EXISTING GITHUB PAGES WEBSITE
1. Open the GitHub repository in a browser.
2. Choose Add file > Upload files.
3. Drag these eight files from the unzipped package.
4. Choose the option to replace existing files if prompted, then commit the changes.
5. Wait for GitHub Pages to finish deploying in Actions or Settings > Pages.
6. On your phone, close the app and reopen it. If the old version persists,
   open the website in the browser, refresh it, and relaunch the home-screen app.

LOCAL TEST ON WINDOWS
1. Open a terminal in the folder containing index.html.
2. Run: python -m http.server 8000
3. Open http://localhost:8000 in a browser.

LANGUAGES
English, German, Japanese, Italian, Greek, Traditional Chinese.
All languages use the same international C/B pitch identifiers.

FREE PLAY
Multiple keys may be held simultaneously. The active notes are represented
as a chord. In Auto clef, mixed registers use two separate staves.

TEST
Test mode remains single-note recognition. Touching a piano key submits
one answer. The correct note is then highlighted and played.

DEMO
Tap Demo for an automatic test walkthrough and Mozart-inspired finale.

AUDIO
Uses WebAudioFont Acoustic Grand Piano soundfont. The sound library is fetched
on first load and cached by the service worker for subsequent offline use.
The first page visit needs an internet connection.
