// ─── Daily puzzle selection & seeded randomness ─────────────

// Epoch: March 17, 2026 (launch day)
const EPOCH = new Date("2026-03-17T00:00:00");

export function getDayNumber() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor((today - EPOCH) / 86400000);
}

export function getDailySeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export function getDailyChain(chains) {
  const day = getDayNumber();
  const idx = ((day % chains.length) + chains.length) % chains.length;
  return { chain: chains[idx], dayNumber: day + 1 };
}

// Seeded PRNG (mulberry32-ish)
export function seededRand(seed) {
  let s = (seed ^ 0xdeadbeef) >>> 0;
  return () => {
    s = Math.imul(s ^ (s >>> 17), 0x45d9f3b) >>> 0;
    s ^= s >>> 15;
    return (s >>> 0) / 0xffffffff;
  };
}

// Fisher-Yates shuffle with seed
export function seededShuffle(arr, seed) {
  const a = [...arr];
  const rand = seededRand(seed);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Scramble a word using seed, ensuring result !== original
export function scrambleWord(word, seed) {
  const chars = word.split("");
  const rand = seededRand(seed);
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  // Ensure scramble is different from the original
  if (chars.join("") === word) {
    [chars[0], chars[1]] = [chars[1], chars[0]];
  }
  return chars;
}
