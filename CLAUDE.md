# Anagram Chain — Daily Anagram Puzzle

A PWA word puzzle game where players unscramble 5 words in a chain. Solve one to unlock the next.

## Tech Stack
- Next.js 16 App Router | React 19 | JavaScript (no TypeScript)
- @ducanh2912/next-pwa for offline/installable support
- Deploy: Vercel (production: anagram.mattatencio.com)
- Inline styles + CSS Modules for animations
- localStorage for persistence (stats, streak, daily completion)
- Fonts: DM Serif Display + Outfit via next/font/google

## Rules
- Every client component must have `"use client"` directive
- Guard all localStorage access with `typeof window !== "undefined"`
- Mobile-first design — viewport-pinned (100dvh, no scroll), max-width 430px
- No backend — everything runs client-side
- Chains use seeded daily rotation via getDailyChain()
- Build uses `--webpack` flag (next-pwa incompatible with Turbopack)
- Cloudflare DNS must be DNS-only (no proxy) for Vercel SSL

## Structure
```
app/
  layout.js                    — Root layout with PWA meta, fonts, OG tags
  page.js                      — Renders <AnagramGame />
  globals.css                  — Reset + scroll prevention
components/
  AnagramGame.jsx              — Core game component (tap-to-place letters)
  AnagramGame.module.css       — Animations, tile styles, modals
data/
  chains.js                    — 90 chain definitions (5 words each)
lib/
  daily.js                     — Seeded daily puzzle selection + scramble
public/
  manifest.json                — PWA manifest
  icon-*.png                   — PWA icons
```

## Running Locally
```bash
npm run dev    # http://localhost:3000 (Turbopack)
npm run build  # Production build (webpack, generates service worker)
```

## Deploying
```bash
npx vercel --prod  # Deploys to anagram.mattatencio.com
```
