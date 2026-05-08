# Primo Manifest

Primo Manifest is a fan-made luck-manifesting app for Genshin Impact fans.
Users upload a selfie, select a desired character, set a ritual mood, and
receive a playful wish probability reading with a share-ready portrait.

## Features
- Selfie upload with client-side portrait rendering
- Desired character selector with element-inspired colors
- Ritual mood input for a more personal reading
- Dynamic fortune card and wish probability
- Soft pastel generated portrait with floral frame details
- Zoomed selfie crop that fills the generated portrait
- Loading state before revealing the result
- Saveable PNG portrait
- Static HTML, CSS, and JavaScript only

## Run Locally
Open `index.html` in a browser.

No install step is required.

## Deploy to Vercel
This is a static site. In Vercel, import the GitHub repo and use the default
settings:
- Framework preset: Other
- Build command: leave empty
- Output directory: leave empty

Point the custom domain to `primo.joemidpan.com` after the project is created.

## Project Files
- `index.html` - app markup
- `styles.css` - fantasy UI styling
- `script.js` - upload, reading, and canvas portrait logic
- `reference.jpg` - visual reference for the generated portrait style
- `vercel.json` - static deployment headers and clean URL setting
- `AGENTS.md` - project guidance for coding agents

## Manual Testing
After UI changes, manually check:
- Photo upload
- Character selection
- Ritual mood input
- Reading generation
- Generated portrait rendering
- PNG saving

## Notes
This is an unofficial fan project. It does not use official Genshin Impact
artwork, logos, or assets.
