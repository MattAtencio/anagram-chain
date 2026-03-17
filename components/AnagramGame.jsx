"use client";

// ============================================================
//  ANAGRAM CHAIN — Daily Anagram Puzzle Game
// ============================================================

import { useState, useEffect, useCallback, useRef } from "react";
import CHAINS from "../data/chains";
import { getDailyChain, getDailySeed, scrambleWord } from "../lib/daily";
import { playTap, playPlace, playCorrect, playWrong, playComplete, playHint } from "../lib/sounds";
import { launchConfetti } from "../lib/confetti";
import styles from "./AnagramGame.module.css";

// ─── Font constants ──────────────────────────────────────────
const F_OUT = "var(--font-outfit, 'Outfit', sans-serif)";
const F_SER = "var(--font-dm-serif, 'DM Serif Display', serif)";

// ─── localStorage helpers ────────────────────────────────────
function loadStorage(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const val = localStorage.getItem(key);
    return val !== null ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage(key, value) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded
  }
}

// ─── Format seconds as M:SS ─────────────────────────────────
function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ─── Onboarding Modal ───────────────────────────────────────
function OnboardingModal({ onClose }) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 36, fontWeight: 400, fontStyle: "italic", color: "#fff", lineHeight: 1 }}>
            Anagram Chain
          </div>
          <div style={{ fontFamily: F_OUT, fontSize: 11, color: "#555577", marginTop: 6 }}>
            Daily word puzzle
          </div>
        </div>

        <div style={{ fontFamily: F_OUT, fontSize: 13, color: "#c8c8e0", lineHeight: 1.6, marginBottom: 16 }}>
          Unscramble <span style={{ color: "#0ea5e9", fontWeight: 700 }}>5 words</span> in a chain.
          Solve one to unlock the next.
        </div>

        {/* Demo visual */}
        <div style={{ background: "#07070f", borderRadius: 14, padding: "12px 10px", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 8 }}>
            {["L", "P", "A", "M"].map((l, i) => (
              <div key={i} style={{
                width: 40, height: 44, borderRadius: 10,
                background: "#0d1a2e", border: "1.5px solid #1e3a5f",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: F_OUT, fontWeight: 700, fontSize: 18, color: "#e8e8f0",
              }}>
                {l}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 6 }}>
            {["L", "A", "M", "P"].map((l, i) => (
              <div key={i} style={{
                width: 36, height: 40, borderRadius: 8,
                background: "#0ea5e90d", border: "1.5px solid #0ea5e933",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: F_OUT, fontWeight: 700, fontSize: 16, color: "#0ea5e9",
              }}>
                {l}
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", fontFamily: F_OUT, fontSize: 11, color: "#22c55e", fontWeight: 700 }}>
            {"\u2713"} LAMP
          </div>
        </div>

        <div style={{ fontFamily: F_OUT, fontSize: 12, color: "#555577", lineHeight: 1.6, marginBottom: 6 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
            <span style={{ color: "#0ea5e9", fontSize: 14, lineHeight: 1 }}>{"\u{1f524}"}</span>
            <span><span style={{ color: "#c8c8e0" }}>Tap</span> scrambled letters to place them in order</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
            <span style={{ color: "#22c55e", fontSize: 14, lineHeight: 1 }}>{"\u2713"}</span>
            <span>Words get longer: 4 {"\u2192"} 5 {"\u2192"} 6 letters</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
            <span style={{ color: "#ffd166", fontSize: 14, lineHeight: 1 }}>{"\u23f1\ufe0f"}</span>
            <span>Timer runs the entire chain — race the clock!</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ color: "#a78bfa", fontSize: 14, lineHeight: 1 }}>{"\ud83d\udca1"}</span>
            <span>Use hints if stuck (+15s penalty each)</span>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: "100%", padding: "14px", marginTop: 16,
            background: "linear-gradient(135deg, #0c4a6e, #0ea5e9)",
            border: "none", borderRadius: 14, color: "#fff",
            fontFamily: F_OUT, fontWeight: 700, fontSize: 13,
            letterSpacing: 2, cursor: "pointer",
            boxShadow: "0 6px 24px #0ea5e955",
          }}
        >
          PLAY
        </button>
      </div>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────
export default function AnagramGame() {
  const seed = getDailySeed();
  const { chain, dayNumber } = getDailyChain(CHAINS);

  // ── Load saved state (if already played today) ─────────────
  const [savedState] = useState(() => {
    const saved = loadStorage("anagram-state", null);
    if (saved && saved.seed === seed) return saved;
    return null;
  });

  // ── Game state ─────────────────────────────────────────────
  const [phase, setPhase] = useState(savedState ? "complete" : "ready");
  const [wordIndex, setWordIndex] = useState(savedState ? 5 : 0);
  const [scrambled, setScrambled] = useState([]);
  const [placed, setPlaced] = useState([]);
  const [elapsed, setElapsed] = useState(savedState?.totalTime ?? 0);
  const [wordTimes, setWordTimes] = useState(savedState?.wordTimes ?? []);
  const [wordStartTime, setWordStartTime] = useState(null);
  const [solvedCount, setSolvedCount] = useState(savedState?.solvedCount ?? 0);
  const [failed, setFailed] = useState(savedState?.failed ?? false);
  const [failedAt, setFailedAt] = useState(savedState?.failedAt ?? -1);
  const timerRef = useRef(null);

  // ── Hint state ─────────────────────────────────────────────
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintedSlots, setHintedSlots] = useState(new Set());
  const MAX_HINTS_PER_WORD = 1;
  const HINT_PENALTY = 15;

  // ── Onboarding ─────────────────────────────────────────────
  const [showOnboarding, setShowOnboarding] = useState(
    () => !loadStorage("anagram-onboarded", false)
  );

  // ── Stats ──────────────────────────────────────────────────
  const [stats, setStats] = useState(() =>
    loadStorage("anagram-stats", {
      played: 0,
      completed: 0,
      currentStreak: 0,
      maxStreak: 0,
      bestTime: null,
    })
  );

  // ── Streak calculation ─────────────────────────────────────
  const streak = (() => {
    const data = loadStorage("anagram-streak", { count: 0, lastDate: null });
    if (!data.lastDate) return data.count;
    const last = new Date(data.lastDate + "T00:00:00");
    const today = new Date(new Date().toISOString().slice(0, 10) + "T00:00:00");
    const diffDays = Math.round((today - last) / 86400000);
    if (diffDays > 1) return 0;
    return data.count;
  })();

  // ── Set up scrambled letters for current word ──────────────
  const setupWord = useCallback(
    (idx) => {
      const word = chain.words[idx];
      const letters = scrambleWord(word, seed + idx);
      setScrambled(letters);
      setPlaced(new Array(word.length).fill(null));
      setWordStartTime(Date.now());
      setHintsUsed(0);
      setHintedSlots(new Set());
    },
    [chain.words, seed]
  );

  // ── Timer ──────────────────────────────────────────────────
  useEffect(() => {
    if (phase === "playing") {
      timerRef.current = setInterval(() => {
        setElapsed((e) => e + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  // ── Keyboard input ─────────────────────────────────────────
  useEffect(() => {
    if (phase !== "playing") return;

    const handleKeyPress = (e) => {
      const key = e.key.toUpperCase();

      // Backspace — remove last placed letter
      if (e.key === "Backspace") {
        e.preventDefault();
        for (let i = placed.length - 1; i >= 0; i--) {
          if (placed[i] !== null && !hintedSlots.has(i)) {
            const newPlaced = [...placed];
            newPlaced[i] = null;
            setPlaced(newPlaced);
            playTap();
            break;
          }
        }
        return;
      }

      // Enter — submit if all filled
      if (e.key === "Enter") {
        e.preventDefault();
        if (placed.length > 0 && placed.every((p) => p !== null)) {
          submitAnswer();
        }
        return;
      }

      // Letter key — find matching unplaced tile
      if (/^[A-Z]$/.test(key)) {
        e.preventDefault();
        const usedIndices = new Set(
          placed.filter((p) => p !== null).map((p) => p.sourceIdx)
        );
        const matchIdx = scrambled.findIndex(
          (letter, i) => letter === key && !usedIndices.has(i)
        );
        if (matchIdx !== -1) {
          placeLetter(matchIdx);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [phase, placed, scrambled, hintedSlots]);

  // ── Start game ─────────────────────────────────────────────
  const startGame = () => {
    setPhase("playing");
    setWordIndex(0);
    setElapsed(0);
    setWordTimes([]);
    setSolvedCount(0);
    setFailed(false);
    setFailedAt(-1);
    setupWord(0);
  };

  // ── Tap a scrambled letter tile ────────────────────────────
  const placeLetter = (sourceIdx) => {
    if (phase !== "playing") return;
    const emptyIdx = placed.indexOf(null);
    if (emptyIdx === -1) return;
    const newPlaced = [...placed];
    newPlaced[emptyIdx] = { letter: scrambled[sourceIdx], sourceIdx };
    setPlaced(newPlaced);
    playPlace();
  };

  // ── Tap a placed letter to remove it ───────────────────────
  const removeLetter = (slotIdx) => {
    if (phase !== "playing") return;
    if (!placed[slotIdx]) return;
    if (hintedSlots.has(slotIdx)) return; // Can't remove hinted letters
    const newPlaced = [...placed];
    newPlaced[slotIdx] = null;
    setPlaced(newPlaced);
    playTap();
  };

  // ── Check if all slots are filled ──────────────────────────
  const allFilled = placed.length > 0 && placed.every((p) => p !== null);

  // ── Hint — reveal one correct letter ───────────────────────
  const useHint = () => {
    if (phase !== "playing") return;
    if (hintsUsed >= MAX_HINTS_PER_WORD) return;

    const word = chain.words[wordIndex];
    // Find first slot that isn't already correctly hinted
    for (let i = 0; i < word.length; i++) {
      if (hintedSlots.has(i)) continue;

      // Clear any existing letter in this slot (if wrong)
      const newPlaced = [...placed];

      // Return any letter currently in this slot back to the pool
      if (newPlaced[i] !== null) {
        newPlaced[i] = null;
      }

      // Find the correct letter in scrambled tiles
      const correctLetter = word[i];
      const usedIndices = new Set(
        newPlaced.filter((p) => p !== null).map((p) => p.sourceIdx)
      );
      const sourceIdx = scrambled.findIndex(
        (letter, idx) => letter === correctLetter && !usedIndices.has(idx)
      );

      if (sourceIdx !== -1) {
        newPlaced[i] = { letter: correctLetter, sourceIdx };
        setPlaced(newPlaced);
        setHintedSlots(new Set([...hintedSlots, i]));
        setHintsUsed((h) => h + 1);
        setElapsed((e) => e + HINT_PENALTY);
        playHint();
        break;
      }
    }
  };

  // ── Submit answer ──────────────────────────────────────────
  const submitAnswer = () => {
    if (!allFilled) return;
    const answer = placed.map((p) => p.letter).join("");
    const correct = chain.words[wordIndex];

    if (answer === correct) {
      playCorrect();
      const wordTime = Math.round((Date.now() - wordStartTime) / 1000);
      const newWordTimes = [...wordTimes, wordTime];
      setWordTimes(newWordTimes);
      setSolvedCount((c) => c + 1);
      setPhase("correct");

      setTimeout(() => {
        if (wordIndex < 4) {
          const nextIdx = wordIndex + 1;
          setWordIndex(nextIdx);
          setupWord(nextIdx);
          setPhase("playing");
        } else {
          playComplete();
          launchConfetti();
          completeGame(newWordTimes, wordIndex + 1, false, -1);
        }
      }, 800);
    } else {
      playWrong();
      setPhase("wrong");
      setTimeout(() => {
        // Keep hinted slots, clear the rest
        const newPlaced = placed.map((p, i) => (hintedSlots.has(i) ? p : null));
        setPlaced(newPlaced);
        setPhase("playing");
      }, 500);
    }
  };

  // ── Shuffle remaining letters ──────────────────────────────
  const shuffleLetters = () => {
    if (phase !== "playing") return;
    const usedIndices = new Set(
      placed.filter((p) => p !== null).map((p) => p.sourceIdx)
    );
    const availableIndices = scrambled
      .map((_, i) => i)
      .filter((i) => !usedIndices.has(i));

    const availableLetters = availableIndices.map((i) => scrambled[i]);
    for (let i = availableLetters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableLetters[i], availableLetters[j]] = [
        availableLetters[j],
        availableLetters[i],
      ];
    }

    const newScrambled = [...scrambled];
    availableIndices.forEach((origIdx, i) => {
      newScrambled[origIdx] = availableLetters[i];
    });
    setScrambled(newScrambled);
    playTap();
  };

  // ── Clear placed letters (preserve hinted) ─────────────────
  const clearPlaced = () => {
    if (phase !== "playing") return;
    const newPlaced = placed.map((p, i) => (hintedSlots.has(i) ? p : null));
    setPlaced(newPlaced);
    playTap();
  };

  // ── Complete game ──────────────────────────────────────────
  const completeGame = (finalWordTimes, finalSolvedCount, didFail, failIdx) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("complete");

    const totalTime = elapsed;
    const newStreak = didFail ? 0 : streak + 1;

    const newStats = {
      played: stats.played + 1,
      completed: didFail ? stats.completed : stats.completed + 1,
      currentStreak: newStreak,
      maxStreak: Math.max(stats.maxStreak, newStreak),
      bestTime:
        !didFail && (stats.bestTime === null || totalTime < stats.bestTime)
          ? totalTime
          : stats.bestTime,
    };
    setStats(newStats);
    saveStorage("anagram-stats", newStats);

    const today = new Date().toISOString().slice(0, 10);
    saveStorage("anagram-streak", { count: newStreak, lastDate: today });

    saveStorage("anagram-state", {
      seed,
      totalTime,
      wordTimes: finalWordTimes,
      solvedCount: finalSolvedCount,
      failed: didFail,
      failedAt: failIdx,
    });
  };

  // ── Share results ──────────────────────────────────────────
  const shareResults = () => {
    const totalSolved = savedState ? savedState.solvedCount : solvedCount;
    const totalTime = savedState ? savedState.totalTime : elapsed;
    const wasFailed = savedState ? savedState.failed : failed;

    const dots = chain.words
      .map((_, i) => {
        if (i < totalSolved) return "\u{1f7e9}";
        if (wasFailed && i === (savedState ? savedState.failedAt : failedAt))
          return "\u{1f7e5}";
        return "\u2b1c";
      })
      .join("");

    const text = `Anagram Chain #${dayNumber} \u26d3\ufe0f\n${dots}\n${totalSolved}/5 | \u23f1\ufe0f ${formatTime(totalTime)}\nanagram.mattatencio.com`;

    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard?.writeText(text);
      alert("Copied to clipboard!");
    }
  };

  // ── Determine which source indices are used ────────────────
  const usedSourceIndices = new Set(
    placed.filter((p) => p !== null).map((p) => p.sourceIdx)
  );

  const canHint = phase === "playing" && hintsUsed < MAX_HINTS_PER_WORD;

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className={styles.container} style={{ fontFamily: F_SER }}>
      {/* Onboarding modal for new users */}
      {showOnboarding && (
        <OnboardingModal
          onClose={() => {
            setShowOnboarding(false);
            saveStorage("anagram-onboarded", true);
          }}
        />
      )}

      {/* Ambient glow */}
      <div className={styles.ambientGlow} />

      {/* ── Header ── */}
      <div
        style={{
          paddingTop: 16,
          paddingBottom: 8,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexShrink: 0,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 400,
              letterSpacing: "-1px",
              color: "#fff",
              lineHeight: 1,
              fontStyle: "italic",
            }}
          >
            Anagram Chain
          </div>
          <div
            style={{
              fontFamily: F_OUT,
              fontSize: 9,
              color: "#33334a",
              letterSpacing: 3,
              marginTop: 3,
            }}
          >
            DAILY &middot; #{dayNumber}
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "center", paddingTop: 2 }}>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: F_OUT,
                fontWeight: 700,
                fontSize: 16,
                color: "#ffd166",
              }}
            >
              {"\ud83d\udd25"} {streak}
            </div>
            <div
              style={{
                fontFamily: F_OUT,
                fontSize: 7,
                color: "#33334a",
                letterSpacing: 1.5,
              }}
            >
              STREAK
            </div>
          </div>
          {(phase === "playing" || phase === "correct" || phase === "wrong") && (
            <div style={{ textAlign: "center", minWidth: 48 }}>
              <div
                style={{
                  fontFamily: F_OUT,
                  fontWeight: 700,
                  fontSize: 18,
                  color: "#0ea5e9",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatTime(elapsed)}
              </div>
              <div
                style={{
                  fontFamily: F_OUT,
                  fontSize: 7,
                  color: "#33334a",
                  letterSpacing: 1.5,
                }}
              >
                TIME
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Progress Dots ── */}
      <div className={styles.progressDots} style={{ flexShrink: 0 }}>
        {chain.words.map((_, i) => {
          let dotClass = styles.dot;
          const totalSolved = savedState ? savedState.solvedCount : solvedCount;
          const wasFailed = savedState ? savedState.failed : failed;
          const failPoint = savedState ? savedState.failedAt : failedAt;

          if (i < totalSolved) dotClass += " " + styles.dotSolved;
          else if (wasFailed && i === failPoint)
            dotClass += " " + styles.dotFailed;
          else if (i === wordIndex && phase === "playing")
            dotClass += " " + styles.dotActive;

          return <div key={i} className={dotClass} />;
        })}
      </div>

      {/* ── Ready Screen ── */}
      {phase === "ready" && (
        <div
          className={styles.fadeUp}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>{"\u26d3\ufe0f"}</div>
            <div
              style={{
                fontFamily: F_OUT,
                fontSize: 14,
                color: "#555577",
                lineHeight: 1.6,
                maxWidth: 280,
              }}
            >
              Unscramble <span style={{ color: "#0ea5e9", fontWeight: 700 }}>5 words</span> in
              a chain. Solve one to unlock the next.
            </div>
          </div>

          <div
            style={{
              fontFamily: F_OUT,
              fontSize: 12,
              color: "#33334a",
              textAlign: "center",
              lineHeight: 1.8,
            }}
          >
            <div>
              <span style={{ color: "#22c55e" }}>{"\u25cf"}</span> 4 letters{" "}
              <span style={{ color: "#0ea5e9" }}>{"\u2192"}</span> 5 letters{" "}
              <span style={{ color: "#0ea5e9" }}>{"\u2192"}</span> 6 letters
            </div>
            <div style={{ marginTop: 4 }}>Timer runs the whole chain</div>
          </div>

          {stats.played > 0 && (
            <div
              style={{
                fontFamily: F_OUT,
                fontSize: 11,
                color: "#33334a",
                textAlign: "center",
              }}
            >
              Played: {stats.played} | Completed: {stats.completed}
              {stats.bestTime !== null && ` | Best: ${formatTime(stats.bestTime)}`}
            </div>
          )}

          <button
            onClick={startGame}
            style={{
              width: "100%",
              maxWidth: 280,
              padding: "14px",
              background: "linear-gradient(135deg, #0c4a6e, #0ea5e9)",
              border: "none",
              borderRadius: 14,
              color: "#fff",
              fontFamily: F_OUT,
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: 2,
              cursor: "pointer",
              boxShadow: "0 6px 24px #0ea5e955",
            }}
          >
            START CHAIN {"\u2192"}
          </button>
        </div>
      )}

      {/* ── Playing / Correct / Wrong ── */}
      {(phase === "playing" || phase === "correct" || phase === "wrong") && (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 4,
          }}
        >
          {/* Word number & length hint */}
          <div
            style={{
              textAlign: "center",
              fontFamily: F_OUT,
              fontSize: 12,
              color: "#33334a",
              marginBottom: 4,
              flexShrink: 0,
            }}
          >
            Word {wordIndex + 1} of 5 &middot;{" "}
            {chain.words[wordIndex].length} letters
          </div>

          {/* Answer Slots */}
          <div
            className={`${styles.slotsArea} ${phase === "wrong" ? styles.shake : ""} ${phase === "correct" ? styles.correctFlash : ""}`}
            style={{ flexShrink: 0 }}
          >
            {placed.map((p, i) => (
              <div
                key={i}
                className={`${styles.slot} ${p ? styles.slotFilled : ""} ${p ? styles.popIn : ""} ${hintedSlots.has(i) ? styles.hintedSlot : ""}`}
                onClick={() => removeLetter(i)}
                style={{
                  fontFamily: F_OUT,
                  ...(phase === "correct"
                    ? {
                        borderColor: "#22c55e88",
                        background: "#22c55e22",
                        color: "#22c55e",
                      }
                    : {}),
                  ...(hintedSlots.has(i) && phase !== "correct"
                    ? {
                        borderColor: "#a78bfa55",
                        background: "#a78bfa11",
                        color: "#a78bfa",
                        cursor: "default",
                      }
                    : {}),
                }}
              >
                {p ? p.letter : ""}
              </div>
            ))}
          </div>

          {/* Correct word flash */}
          {phase === "correct" && (
            <div
              className={styles.popIn}
              style={{
                textAlign: "center",
                fontFamily: F_OUT,
                fontWeight: 700,
                fontSize: 16,
                color: "#22c55e",
                padding: "8px 0",
              }}
            >
              {"\u2713"} {chain.words[wordIndex]}
            </div>
          )}

          {/* Scrambled Letter Tiles */}
          {phase !== "correct" && (
            <div className={styles.tilesArea} style={{ flexShrink: 0 }}>
              {scrambled.map((letter, i) => (
                <div
                  key={`${wordIndex}-${i}`}
                  className={`${styles.tile} ${usedSourceIndices.has(i) ? styles.tileUsed : ""}`}
                  onClick={() => !usedSourceIndices.has(i) && placeLetter(i)}
                  style={{ fontFamily: F_OUT }}
                >
                  {letter}
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          {phase === "playing" && (
            <div
              style={{
                display: "flex",
                gap: 6,
                paddingTop: 12,
                flexShrink: 0,
              }}
            >
              <button
                onClick={clearPlaced}
                style={{
                  flex: 1,
                  padding: "12px 8px",
                  background: "#0d0d1e",
                  border: "1px solid #1c1c35",
                  borderRadius: 12,
                  color: "#555577",
                  fontFamily: F_OUT,
                  fontWeight: 600,
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                {"\u21ba"} Clear
              </button>
              <button
                onClick={shuffleLetters}
                style={{
                  flex: 1,
                  padding: "12px 8px",
                  background: "#0d0d1e",
                  border: "1px solid #1c1c35",
                  borderRadius: 12,
                  color: "#555577",
                  fontFamily: F_OUT,
                  fontWeight: 600,
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                {"\ud83d\udd00"} Shuffle
              </button>
              <button
                onClick={useHint}
                disabled={!canHint}
                style={{
                  flex: 1,
                  padding: "12px 8px",
                  background: canHint ? "#1a1035" : "#0d0d1e",
                  border: `1px solid ${canHint ? "#a78bfa33" : "#1c1c35"}`,
                  borderRadius: 12,
                  color: canHint ? "#a78bfa" : "#33334a",
                  fontFamily: F_OUT,
                  fontWeight: 600,
                  fontSize: 11,
                  cursor: canHint ? "pointer" : "default",
                }}
              >
                {"\ud83d\udca1"} Hint
              </button>
              <button
                onClick={submitAnswer}
                disabled={!allFilled}
                style={{
                  flex: 2,
                  padding: "12px",
                  background: allFilled
                    ? "linear-gradient(135deg, #0c4a6e, #0ea5e9)"
                    : "#0d0d1e",
                  border: allFilled ? "none" : "1px solid #1c1c35",
                  borderRadius: 12,
                  color: allFilled ? "#fff" : "#33334a",
                  fontFamily: F_OUT,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: allFilled ? "pointer" : "default",
                  boxShadow: allFilled ? "0 4px 16px #0ea5e944" : "none",
                  transition: "all 0.2s ease",
                }}
              >
                Submit
              </button>
            </div>
          )}

          {/* Keyboard hint for desktop */}
          <div
            style={{
              textAlign: "center",
              fontFamily: F_OUT,
              fontSize: 9,
              color: "#1c1c35",
              marginTop: 8,
              flexShrink: 0,
            }}
          >
            Type letters on keyboard &middot; Enter to submit &middot; Backspace to undo
          </div>
        </div>
      )}

      {/* ── Complete Screen ── */}
      {phase === "complete" && (
        <div
          className={styles.fadeUp}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 16,
          }}
        >
          {/* Title */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 4 }}>
              {(savedState ? savedState.solvedCount : solvedCount) === 5
                ? "\ud83c\udf89"
                : "\u26d3\ufe0f"}
            </div>
            <div
              style={{
                fontFamily: F_OUT,
                fontWeight: 700,
                fontSize: 20,
                color: "#fff",
              }}
            >
              {(savedState ? savedState.solvedCount : solvedCount) === 5
                ? "Chain Complete!"
                : "Chain Broken"}
            </div>
          </div>

          {/* Stats Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 24,
              fontFamily: F_OUT,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#0ea5e9" }}>
                {savedState ? savedState.solvedCount : solvedCount}/5
              </div>
              <div style={{ fontSize: 9, color: "#33334a", letterSpacing: 1.5 }}>
                SOLVED
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#0ea5e9",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatTime(savedState ? savedState.totalTime : elapsed)}
              </div>
              <div style={{ fontSize: 9, color: "#33334a", letterSpacing: 1.5 }}>
                TIME
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#ffd166" }}>
                {"\ud83d\udd25"}{" "}
                {savedState
                  ? loadStorage("anagram-streak", { count: 0 }).count
                  : streak}
              </div>
              <div style={{ fontSize: 9, color: "#33334a", letterSpacing: 1.5 }}>
                STREAK
              </div>
            </div>
          </div>

          {/* Per-word times */}
          <div
            style={{
              background: "#0d0d1e",
              border: "1px solid #1c1c35",
              borderRadius: 14,
              padding: "12px 16px",
            }}
          >
            {chain.words.map((word, i) => {
              const times = savedState ? savedState.wordTimes : wordTimes;
              const totalSolved = savedState
                ? savedState.solvedCount
                : solvedCount;
              const solved = i < totalSolved;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 0",
                    borderBottom:
                      i < 4 ? "1px solid #1c1c35" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 6,
                        background: solved ? "#22c55e22" : "#ef444422",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        color: solved ? "#22c55e" : "#ef4444",
                        fontFamily: F_OUT,
                        fontWeight: 700,
                      }}
                    >
                      {solved ? "\u2713" : "\u2717"}
                    </div>
                    <span
                      style={{
                        fontFamily: F_OUT,
                        fontSize: 13,
                        color: solved ? "#c8c8e0" : "#555577",
                        fontWeight: 600,
                      }}
                    >
                      {solved ? word : "???"}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: F_OUT,
                      fontSize: 12,
                      color: "#33334a",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {solved && times[i] !== undefined
                      ? formatTime(times[i])
                      : "\u2014"}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={shareResults}
              style={{
                flex: 2,
                padding: "13px",
                background: "linear-gradient(135deg, #064e3b, #059669)",
                border: "none",
                borderRadius: 14,
                color: "#fff",
                fontFamily: F_OUT,
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
                boxShadow: "0 4px 16px #05966944",
              }}
            >
              Share Result {"\ud83d\udce4"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
