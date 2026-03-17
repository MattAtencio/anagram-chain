# Anagram Chain — Development Plan

## Overview
Target: ~1 hour to playable MVP, matching Spectrum's patterns.

---

## Phase 1: Project Scaffolding (~10 min)
- [ ] `npx create-next-app@latest` with App Router, JavaScript, no TypeScript
- [ ] Install `@ducanh2912/next-pwa`
- [ ] Configure `next.config.mjs` (PWA + webpack build)
- [ ] Set up `manifest.json`, placeholder icons
- [ ] Configure fonts (DM Serif Display + Outfit)
- [ ] Set up `globals.css` (dark theme, scroll lock, CSS vars)
- [ ] Create `CLAUDE.md` with project rules
- [ ] Create `jsconfig.json` with path aliases

## Phase 2: Game Data (~10 min)
- [ ] Create `data/chains.js` — 30+ curated word chains
  - Each chain: 5 words (4, 5, 5, 6, 6 letters)
  - Manually picked for clear solutions, fun scrambles
- [ ] Create `lib/daily.js` — seeded daily puzzle selector
  - Epoch-based day index into chains array
  - Seeded scramble function

## Phase 3: Core Game Component (~25 min)
- [ ] `AnagramGame.jsx` — main game state machine
  - States: daily-screen → playing → word-complete → chain-complete
  - Letter tile tap-to-place mechanics
  - Answer validation
  - Timer (elapsed, per-word tracking)
  - Chain progress bar (1/5 → 5/5)
- [ ] `AnagramGame.module.css` — styles and animations
  - Letter tile styling (rounded, shadow, tap states)
  - Shake animation (wrong answer)
  - Slide-in animation (next word)
  - Progress bar styling

## Phase 4: Results & Sharing (~10 min)
- [ ] Results modal with:
  - Chain completion status
  - Total time + per-word breakdown
  - Streak display
  - Share button → clipboard with emoji grid
- [ ] localStorage persistence:
  - Daily completion state
  - Stats (played, completed, streaks, best time)

## Phase 5: Polish & Deploy (~5 min)
- [ ] `app/layout.js` — meta tags, OG image tags, viewport
- [ ] `app/page.js` — render AnagramGame
- [ ] Test PWA install flow
- [ ] `vercel deploy` → configure anagram.mattatencio.com
- [ ] Cloudflare DNS: CNAME → cname.vercel-dns.com (DNS only, no proxy)

---

## Quick MVP Feature Set
These keep it playable and fun in minimal code:

1. **Tap-to-place letters** — tap scrambled tile → fills next blank slot. Tap placed letter → returns it. Simple, no drag-and-drop needed for MVP.
2. **Shuffle button** — re-scrambles available letters when stuck. Cheap to implement, high value.
3. **Running timer** — creates urgency without punishing. Counting UP, not down.
4. **Chain progress dots** — visual 5-dot indicator showing progress. Each dot fills/colors on solve.
5. **Share with emoji grid** — one-tap copy. The viral mechanic.
6. **Streak counter** — play every day motivation.

## Future Feature Roadmap (Post-Launch)

### Tier 1 — Quick Adds (30 min each)
- **Hint button:** Reveals one correct letter position, adds 15s time penalty
- **Keyboard input:** Type letters instead of just tapping (desktop support)
- **Sound effects:** Tap, correct, wrong, chain-complete sounds
- **Onboarding modal:** First-visit tutorial explaining rules

### Tier 2 — Medium Effort (1-2 hours each)
- **Hard mode toggle:** Countdown timer (3 min total for chain)
- **Stats page:** Calendar heatmap, average times, best streaks chart
- **Themed chains:** All words relate to a theme, revealed after completion
- **Confetti/celebration:** Canvas confetti on perfect chain

### Tier 3 — Bigger Features (Half day+)
- **Bonus round:** After chain, unscramble a word made from first letters of all 5 answers
- **Multiplayer race:** Share a link, both solve same chain, compare times live
- **Difficulty settings:** Easy (4,4,5,5,5) / Normal (4,5,5,6,6) / Hard (5,6,6,7,7)
- **Custom chains:** Let users create and share custom chains
