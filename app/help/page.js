"use client";

import Link from "next/link";

const F_OUT = "var(--font-outfit, 'Outfit', sans-serif)";
const F_SER = "var(--font-dm-serif, 'DM Serif Display', serif)";

export default function HelpPage() {
  return (
    <div
      style={{
        maxWidth: 430,
        margin: "0 auto",
        padding: "0 16px",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        fontFamily: F_SER,
        position: "relative",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <div style={{ paddingTop: 16, paddingBottom: 16, flexShrink: 0 }}>
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
          GUIDE
        </div>
      </div>

      {/* How to Play */}
      <Section title="How to Play">
        <Step icon={"\uD83D\uDD24"} color="#0ea5e9">
          Each day, you get a chain of <strong style={{ color: "#0ea5e9" }}>5 scrambled words</strong> to
          unscramble. Solve one word to unlock the next.
        </Step>
        <Step icon={"\u2B06\uFE0F"} color="#22c55e">
          Words get progressively longer: start with <strong style={{ color: "#22c55e" }}>4 letters</strong>,
          then 5, then 6. The challenge grows as you go.
        </Step>
        <Step icon={"\uD83D\uDC46"} color="#e8e8f0">
          <strong style={{ color: "#e8e8f0" }}>Tap</strong> the scrambled letter tiles to place them into
          the answer slots. Tap a placed letter to remove it. You can also type on a keyboard.
        </Step>
        <Step icon={"\u23F1\uFE0F"} color="#ffd166">
          A <strong style={{ color: "#ffd166" }}>timer</strong> runs for the entire chain. Your total time
          is your score — the faster, the better!
        </Step>
        <Step icon={"\uD83D\uDCA1"} color="#a78bfa">
          Stuck? Use a <strong style={{ color: "#a78bfa" }}>hint</strong> to reveal one correct letter.
          Each hint adds a 15-second penalty to your time.
        </Step>
        <Step icon={"\u2B50"} color="#fbbf24">
          Find valid <strong style={{ color: "#fbbf24" }}>bonus words</strong> — real anagrams of the target
          word that are different from the answer. They count toward your score!
        </Step>
      </Section>

      {/* Tips */}
      <Section title="Tips">
        <Tip>Look for common letter patterns like -ING, -TION, -ED, TH-, and SH- to spot word structure quickly.</Tip>
        <Tip>Try vowels first. Placing vowels often reveals the word shape faster than consonants.</Tip>
        <Tip>Use the <strong style={{ color: "#555577" }}>Shuffle</strong> button to rearrange remaining letters — a fresh arrangement can spark recognition.</Tip>
        <Tip>Save your hint for the longer 6-letter words where there are more possible combinations.</Tip>
        <Tip>If your guess is a real word but not the answer, it might count as a bonus word!</Tip>
      </Section>

      {/* About */}
      <Section title="About">
        <p
          style={{
            fontFamily: F_OUT,
            fontSize: 13,
            color: "#555577",
            lineHeight: 1.7,
          }}
        >
          Anagram Chain is a free daily word puzzle. A new chain is available every day at midnight.
          Your stats, streaks, and completion history are saved locally on your device.
        </p>
        <p
          style={{
            fontFamily: F_OUT,
            fontSize: 13,
            color: "#555577",
            lineHeight: 1.7,
            marginTop: 8,
          }}
        >
          Install it as an app from your browser menu for the best experience — it works offline too.
        </p>
      </Section>

      {/* Back button */}
      <div style={{ padding: "24px 0 32px", flexShrink: 0 }}>
        <Link
          href="/"
          style={{
            display: "block",
            width: "100%",
            padding: "14px",
            background: "linear-gradient(135deg, #0c4a6e, #0ea5e9)",
            border: "none",
            borderRadius: 14,
            color: "#fff",
            fontFamily: F_OUT,
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: 2,
            cursor: "pointer",
            boxShadow: "0 6px 24px #0ea5e955",
            textAlign: "center",
            textDecoration: "none",
          }}
        >
          {"\u2190"} BACK TO GAME
        </Link>
      </div>
    </div>
  );
}

/* ── Reusable sub-components ── */

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20, flexShrink: 0 }}>
      <div
        style={{
          fontFamily: "var(--font-outfit, 'Outfit', sans-serif)",
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: 3,
          color: "#0ea5e9",
          marginBottom: 12,
          textTransform: "uppercase",
        }}
      >
        {title}
      </div>
      <div
        style={{
          background: "#0d0d1e",
          border: "1px solid #1c1c35",
          borderRadius: 14,
          padding: "14px 16px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Step({ icon, color, children }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        marginBottom: 12,
      }}
    >
      <span style={{ color, fontSize: 16, lineHeight: 1, flexShrink: 0, marginTop: 1 }}>
        {icon}
      </span>
      <span
        style={{
          fontFamily: "var(--font-outfit, 'Outfit', sans-serif)",
          fontSize: 13,
          color: "#888898",
          lineHeight: 1.6,
        }}
      >
        {children}
      </span>
    </div>
  );
}

function Tip({ children }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        marginBottom: 10,
      }}
    >
      <span style={{ color: "#22c55e", fontSize: 8, lineHeight: 2.2, flexShrink: 0 }}>{"\u25CF"}</span>
      <span
        style={{
          fontFamily: "var(--font-outfit, 'Outfit', sans-serif)",
          fontSize: 13,
          color: "#888898",
          lineHeight: 1.6,
        }}
      >
        {children}
      </span>
    </div>
  );
}
