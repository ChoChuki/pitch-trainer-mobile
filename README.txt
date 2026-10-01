Pitch Trainer Mobile

Files
- index.html
- styles.css
- app.js
- service-worker.js
- manifest.webmanifest
- icon-192.png
- icon-512.png

Local test
1. Open a terminal in this folder.
2. Run: python -m http.server 8000
3. Open: http://localhost:8000

Mobile installation requires HTTPS.
A static host such as GitHub Pages can host this folder.

Audio
The app uses WebAudioFont with the JCLive Acoustic Grand Piano preset.
The first online load prepares and caches the audio resources.
