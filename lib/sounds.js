// ─── Sound Effects (Web Audio API, no files needed) ─────────
// Generates short synth sounds on the fly

let audioCtx = null;

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(freq, duration, type = "sine", volume = 0.15) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function playTap() {
  playTone(600, 0.08, "sine", 0.1);
}

export function playPlace() {
  playTone(800, 0.1, "sine", 0.12);
}

export function playCorrect() {
  const ctx = getCtx();
  if (!ctx) return;
  // Rising arpeggio
  [523, 659, 784].forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.15, "sine", 0.12), i * 80);
  });
}

export function playWrong() {
  playTone(200, 0.25, "square", 0.08);
  setTimeout(() => playTone(160, 0.3, "square", 0.06), 100);
}

export function playComplete() {
  const ctx = getCtx();
  if (!ctx) return;
  // Celebratory ascending chord
  [523, 659, 784, 1047].forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.3, "sine", 0.1), i * 100);
  });
}

export function playHint() {
  playTone(440, 0.12, "triangle", 0.1);
  setTimeout(() => playTone(330, 0.15, "triangle", 0.08), 80);
}
