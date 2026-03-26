# Anagram Chain — Future Ideas

## Tier 2 — Medium Effort (1-2 hours each)
- **Hard mode toggle:** Countdown timer (3 min total for chain) instead of counting up
- **Stats page:** Calendar heatmap of daily plays, average times, best streaks chart
- **Themed chains:** All 5 words relate to a hidden theme (food, animals, etc.), revealed after completion
- **Daily leaderboard:** Anonymous time rankings for the day's chain (would need a lightweight backend)

## Tier 3 — Bigger Features (Half day+)
- **Bonus round:** After completing chain, unscramble a 6th word made from first letters of all 5 answers
- **Difficulty settings:** Easy (4,4,5,5,5) / Normal (4,5,5,6,6) / Hard (5,6,6,7,7)
- **Multiplayer race:** Share a link, both solve same chain, compare times live
- **Custom chains:** Let users create and share custom word chains

## Polish & Quality of Life
- **Security headers:** Add X-Content-Type-Options, X-Frame-Options, Referrer-Policy in next.config.mjs
- **Better PWA icons:** Replace placeholder 1px PNGs with real branded icons
- **OG image:** Generate a share preview image for social links
- **Accessibility:** Screen reader announcements for correct/wrong/bonus feedback
- **Haptic feedback:** Navigator.vibrate() on mobile for tap/correct/wrong
- **Animated transitions:** Smooth slide between words instead of instant swap
- **Expand bonus words:** Audit and expand bonusWords.js for more valid anagrams
- **Sound toggle:** Mute button in header for users who don't want audio

## Data & Content
- **More chains:** Expand beyond 90 chains (currently ~3 months of daily content)
- **Word difficulty ratings:** Tag words by difficulty for better chain balancing
- **Seasonal/holiday chains:** Special themed chains for holidays
- **Community submissions:** Let players suggest word chains
