# Anagram Chain — Design

## Game Flow

```
[Daily Screen] → [Chain Start] → [Word 1] → [Word 2] → ... → [Word 5] → [Results]
```

### Daily Screen
- Show today's chain number (Day #XX)
- Current streak display
- "Play" button (or "Completed" if already done today)
- Yesterday's stats recap

### Gameplay Screen
- **Top bar:** Timer (counting up) | Chain progress (1/5, 2/5...)
- **Center:** Scrambled letter tiles (tappable/draggable)
- **Answer area:** Blank slots where letters go
- **Controls:** Submit button, Clear/Reset, Shuffle (re-scramble)

### Player Interaction
1. See scrambled letters as tappable tiles
2. Tap tiles to place letters in answer slots (in order tapped)
3. Tap placed letter to return it to the pool
4. Hit "Submit" to check — correct → next word animates in
5. Wrong answer → brief shake animation, tiles reset

### Results Screen
- Chain completion status (e.g., "5/5 solved!")
- Total time
- Per-word times breakdown
- Streak count
- Share button (generates emoji grid)

## Share Format
```
Anagram Chain #42 ⛓️
5/5 | ⏱️ 1:23

🟩🟩🟩🟩🟩
⭐ mattatencio.com/anagram
```
- Green square per word solved
- If failed mid-chain: 🟩🟩🟥⬛⬛ (solved, failed, not attempted)

## Visual Design
- **Theme:** Dark background, clean typography
- **Colors:** Teal/cyan accent (#0ea5e9) on dark (#0a0a1a)
- **Font:** Outfit (body) + DM Serif Display (headers) — matches Spectrum
- **Tiles:** Rounded rectangles, subtle shadow, pop animation on tap
- **Animations:** Letter tile bounce on place, shake on wrong, confetti on chain complete

## Difficulty Curve
| Position | Word Length | Difficulty |
|----------|-----------|------------|
| Word 1 | 4 letters | Easy — warm up |
| Word 2 | 5 letters | Easy-Medium |
| Word 3 | 5 letters | Medium |
| Word 4 | 6 letters | Medium-Hard |
| Word 5 | 6 letters | Hard |

## State (localStorage)
```js
{
  lastPlayedDate: "2026-03-17",
  currentChain: { words: [], startTime, solvedTimes: [] },
  stats: { played: 0, completed: 0, currentStreak: 0, maxStreak: 0, bestTime: null },
  history: { "2026-03-17": { solved: 5, time: 83, words: [...] } }
}
```
