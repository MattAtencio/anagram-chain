# Anagram Chain — Implementation Plan

## Tech Stack (Matching Spectrum)
- **Framework:** Next.js 16 + React 19 (JavaScript, no TypeScript)
- **PWA:** @ducanh2912/next-pwa
- **Styling:** CSS Modules + inline styles
- **Fonts:** DM Serif Display + Outfit (next/font/google)
- **Build:** Webpack (production), Turbopack (dev)
- **Deploy:** Vercel → anagram.mattatencio.com

## Project Structure
```
anagram-chain/
├── app/
│   ├── layout.js          — Root layout, PWA meta, fonts, OG
│   ├── page.js            — Renders AnagramGame component
│   ├── globals.css        — Reset, scroll lock, CSS vars
│   └── favicon.ico
├── components/
│   ├── AnagramGame.jsx    — Core game orchestrator
│   ├── AnagramGame.module.css
│   ├── LetterTile.jsx     — Individual tappable letter tile
│   └── ResultsModal.jsx   — End-of-chain results + share
├── data/
│   └── chains.js          — Word chain definitions (90+ days)
├── lib/
│   └── daily.js           — Seeded daily puzzle selector
├── public/
│   ├── manifest.json
│   ├── icon-192.png
│   └── icon-512.png
├── docs/                  — This documentation
├── package.json
├── next.config.mjs
├── jsconfig.json
└── CLAUDE.md
```

## Core Components

### AnagramGame.jsx (~300 lines target)
- State machine: `idle` → `playing` → `solved` → `next` → ... → `complete`
- Timer (useRef + setInterval, counting up in seconds)
- Current word index, scrambled letters, player's answer
- Handles: tap to place, tap to remove, submit, shuffle
- Triggers results modal on chain complete or fail

### Word Chain Data (chains.js)
- Array of 90+ chain objects, each with 5 words
- Format: `{ id: 1, words: ["LAMP", "CRANE", "STOMP", "BRIDGE", "PLANET"] }`
- Words picked for clear single-anagram solutions
- Scramble generated at runtime (seeded by date for consistency)

### Daily Puzzle Selection (daily.js)
- Same pattern as Spectrum: date-seeded index into chains array
- `getDailyChain(chains)` → returns today's chain
- Ensures same puzzle for all players on same day

## Word List Curation Strategy
- Source: Common English words, no obscure/offensive words
- 4-letter words: ~simple nouns/verbs (LAMP, FISH, BLUE, GOLD)
- 5-letter words: Wordle-tier words (CRANE, STOMP, BLAZE)
- 6-letter words: Recognizable but trickier (BRIDGE, PLANET, MARKET)
- Each word must have a good scramble (no accidental other words)
- Manual curation — quality over quantity

## Key Implementation Details

### Scrambling Algorithm
```js
// Seeded shuffle so all players see same scramble
function scrambleWord(word, seed) {
  const chars = word.split('');
  // Fisher-Yates with seeded random
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  // Ensure scramble !== original
  if (chars.join('') === word) {
    [chars[0], chars[1]] = [chars[1], chars[0]];
  }
  return chars;
}
```

### Timer
- Starts on first word reveal
- Pauses between words (brief "Correct!" celebration)
- Total elapsed time shown in results
- Per-word solve times tracked for stats

### Answer Validation
- Simple string comparison (case-insensitive)
- No partial credit, no hints in MVP
- Wrong answer = shake animation + tiles reset to scrambled

## MVP vs Future Features

### MVP (Ship in ~1 hour)
- [x] 5-word anagram chain with tap-to-place
- [x] Running timer
- [x] Daily puzzle (seeded)
- [x] Chain progress indicator
- [x] Results screen with time
- [x] Share button (clipboard copy)
- [x] Streak tracking
- [x] PWA installable
- [x] Dark theme, mobile-first

### Future Enhancements (Post-Launch Polish)
- **Hints system:** Reveal one letter (costs time penalty)
- **Hard mode:** Timer counts DOWN (e.g., 3 min total)
- **Bonus word:** Unscramble all 5 answers' first letters for a bonus 6th word
- **Animations:** Confetti on perfect chain, letter flip animations
- **Stats dashboard:** Average time, best chain, calendar view
- **Sound effects:** Subtle tap, correct, wrong sounds
- **Onboarding:** First-time tutorial overlay
- **Accessibility:** Keyboard input support, screen reader
- **Multiplayer:** Race mode — share link, compare times live
- **Theme words:** Daily chains follow a hidden theme (all food, all animals, etc.)
