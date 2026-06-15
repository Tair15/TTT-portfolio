# Taiyr Taishanov — Portfolio

A portfolio site with a handwritten-notebook aesthetic: squared paper background,
the KomicnicksCaps handwritten font, scroll-driven 3D business-card animation,
colored pencil lines, ink blots and sticky notes.

Built with **React + TypeScript + Vite + Framer Motion** (CSS Modules for styling).
Assets (font, logos, pencil shavings) are reused from the `C:\card` project.

## Sections

1. **Hero** — the business card fills the viewport, then falls onto the desk as you
   scroll (camera tilts 45° → 0°, card flips once and lands face-up on the right).
2. **About me** — text left, pencil shavings right; colored pencil lines start here
   and draw themselves down to the bottom of the page.
3. **Work experience / Education** — two columns, with the animated rotating-rings
   AITU logo.
4. **Projects** — taped-in cards. *TODO: real project data and screenshots.*
5. **Skills & Say hi** — sticky-note skills + direct contact links (no backend
   needed). *TODO: link a CV pdf.*

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build to dist/
```

## Deploy to GitHub Pages

A workflow at `.github/workflows/deploy.yml` builds and publishes on every push
to `main`. One-time setup:

1. Create a GitHub repository and push this project to `main`.
2. In the repo: **Settings → Pages → Source → GitHub Actions**.

`vite.config.ts` uses `base: './'`, so the site works under any repo name.
