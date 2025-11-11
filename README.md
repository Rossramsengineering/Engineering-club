Engineering Club — Frontend

This repository contains a small static site for the Engineering Club, styled using a Material 3 expressive theme.

Quick overview
- index.html — landing page with hero, carousel and product grid
- store.html — product listing with filters and sorting (JS-powered)
- contact.html — contact form that POSTs to a Google Apps Script endpoint
- order.html — order form and summary
- style.css — central site styles and theme tokens
- theme.css — centralized Material tokens and component defaults
- components.js — small helper that enhances header, accessibility and active navigation
- theme.js — theme toggle (light/dark) with persistence
- Images/ — product and site images

How to preview locally
1. The site is static; open `index.html` or `store.html` in a browser.
2. For best results, serve via a local static server to avoid file:// restrictions (recommended):

   # Python 3 (run in the repo root)
   python -m http.server 8000

   Then visit http://localhost:8000 in your browser.

Fonts and icons
- Fonts are loaded from Google Fonts (Anta for headings, Rubik for body)
- Material Symbols are used for icons

Notes and next steps
- I added `components.js` to centralize header/footer behavior and a few accessibility helpers. It sets active nav links and adds a "Skip to content" link.
- Accessibility: keyboard focus outlines, skip link, and keyboard toggles for custom checkboxes were added. I can add more ARIA semantics and screen-reader text next.
- Core components: if you'd like, I can extract header/footer into a small HTML include or fully dynamic renderer that replaces page headers so edits stay in sync.

If you want me to continue, I can:
- Extract header/footer into a single source (HTML include or JS renderer)
- Add keyboard interactions and aria labels to product cards and modal/product-detail flows
- Add unit/visual tests and a small preview script

Tell me which of those you'd like next and I'll implement it.