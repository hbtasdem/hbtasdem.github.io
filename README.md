# hbtasdem.github.io

My portfolio: [hbtasdem.github.io](https://hbtasdem.github.io). A static [Astro](https://astro.build) site, deployed to GitHub Pages by GitHub Actions.

## Run it locally

Needs Node 22 or newer.

```sh
npm install
npm run dev       # http://localhost:4321, reloads as you edit
npm run build     # production build into dist/
npm run preview   # serve the production build
```

## Add a project

Every project is one Markdown file in `src/content/projects/`. Adding a file adds a card to the home page and the matching area pages, and (unless `caseStudy: false`) a case-study page at `/projects/<file-name>/`. No layout code changes.

```markdown
---
title: My project
summary: One sentence. Shown on cards and in search results.
area: security                # computer-vision | security | swe-ai
tags: [swe-ai]                # other areas it also belongs to (optional)
kind: Hackathon · team of 3   # small label above the title
role: What I did              # optional facts shown at the top of the case study
team: 3 · Event name
timeline: Jan – Mar 2027
stack: [Python, FastAPI]
highlights:                   # up to ~3 short facts for the card
  - { value: '95%', label: 'accuracy' }
links:
  - { label: 'Code on GitHub', href: 'https://github.com/hbtasdem/...' }
cover: ../../assets/my-project/screenshot.png   # optional
coverAlt: What the screenshot shows
caseStudy: true               # false = card only, no page
order: 7                      # lower numbers appear first
---

## Problem
## Approach
## Results
## What I’d do next
```

- **Images:** put them in `src/assets/<project>/` and reference them with a relative path, e.g. `![What it shows](../../assets/my-project/figure.png)`. Astro converts them to WebP at build time. Every image needs alt text that describes what it shows. Two images in the same paragraph sit side by side.
- **Tables and diagrams:** plain HTML inside the Markdown works. Wrap wide tables in `<div class="table-scroll" role="region" aria-label="…" tabindex="0">`, and give charts a text summary or a data table so they don’t rely on the image alone.
- **The schema** lives in `src/content.config.ts`. The build fails with a clear message if a field is missing or misspelled.

Area names, numbers and intro text are in `src/data/areas.ts`. Colors, fonts and spacing are tokens in `src/styles/tokens.css`.

## Update the resume

Replace `public/resume.pdf` with the new export. Links across the site point to `/resume.pdf`, so nothing else changes.

## Deploy

Push to `main`. The workflow in `.github/workflows/deploy.yml` builds the site and publishes it to GitHub Pages, usually in about a minute; progress shows under the repo’s **Actions** tab. One-time setup: in the repo’s **Settings → Pages**, set **Source** to **GitHub Actions**.

## Accessibility

The site targets WCAG 2.2 AA in both themes. Before publishing larger changes:

- run an axe or Lighthouse check on the pages you touched;
- tab through the page: everything should be reachable, in a sensible order, with a visible focus ring;
- check it at 320 px wide and at 200% text zoom;
- check that any new color passes contrast (4.5:1 for text, 3:1 for large text and control borders) in light and dark.
