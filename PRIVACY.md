# Privacy Policy — SITRUS EX

**Last updated:** 2026-04-07

## Summary

SITRUS EX is an unofficial browser extension that changes the appearance of the Shibaura Institute of Technology course registration system (SITRUS) website. It does **not** collect personal data, transmit data to external servers, or modify authentication or grades.

## Data stored locally

The extension uses Chrome’s `chrome.storage.local` API **only** to remember your selected **UI theme** (e.g. Apple / Stripe / Linear) on your device. This data:

- Stays on your computer
- Is not sent to the extension author or third parties
- Can be cleared by removing the extension or clearing site data for the extension in Chrome

## Permissions

| Permission | Why |
|------------|-----|
| `storage` | Save theme preference locally (see above). |

## Content scripts

The extension injects CSS and JavaScript **only** on:

- `https://sitrus.sic.shibaura-it.ac.jp/SITRUS/`
- `https://sitrus.sic.shibaura-it.ac.jp/SITRUS/*/*`

**Web accessible resources** (`assets/images/*`) are used only so the login page background slideshow can load bundled images from the extension package. No remote tracking.

## Contact

For privacy questions about this extension, open an issue on the project repository:  
https://github.com/ShotaYmzk/SITRUS_EX

## Disclaimer

This project is **not** affiliated with Shibaura Institute of Technology or its information systems.
