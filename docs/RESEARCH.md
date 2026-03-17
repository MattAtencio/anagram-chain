# Anagram Chain — Research

## Genre Analysis
- **Wordle** proved daily word puzzles with social sharing are viral — simple rules, one attempt per day, emoji grid sharing
- **Anagram games** (Jumble, Wordscapes, Text Twist) are proven casual formats — scrambled letters → find the word
- **Chain/progression mechanics** add tension and replayability — each solve unlocks the next, creating momentum

## Key Insights from Similar Games
| Game | What Works | What to Steal |
|------|-----------|---------------|
| Wordle | Daily cadence, streak tracking, emoji share grid | Daily puzzle, streak, share button |
| Connections | Progressive difficulty (easy → hard) | Difficulty ramp across chain |
| Spelling Bee | "How far can you get" pressure | Chain = natural progress meter |
| Text Twist | Time pressure on anagrams | Timer adds urgency |

## Core Mechanic: Anagram Chain
- Player gets 5 anagrams in sequence (a "chain")
- Each word solved unlocks the next
- Timer runs across the full chain (not per-word)
- Words increase in difficulty: 4-letter → 5 → 5 → 6 → 6
- Daily puzzle — same chain for everyone, enables social comparison

## Target Audience
- Casual word game fans (Wordle crowd)
- Mobile-first, play during commute/break
- Friends & family sharing scores

## Technical Constraints (Matching Spectrum Pattern)
- Next.js 16 + React 19 (JavaScript)
- PWA via @ducanh2912/next-pwa
- Client-side only, no backend
- localStorage for state persistence
- Mobile-first (max-width 430px, 100dvh)
- Vercel deploy → anagram.mattatencio.com
