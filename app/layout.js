import { DM_Serif_Display, Outfit } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata = {
  title: "Anagram Chain — Daily Word Puzzle",
  description: "Unscramble 5 words in a chain. Solve one to unlock the next. New chain every day.",
  manifest: "/manifest.json",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Anagram Chain",
  },
  openGraph: {
    title: "Anagram Chain — Daily Word Puzzle",
    description: "Unscramble 5 words in a chain. Solve one to unlock the next.",
    type: "website",
    siteName: "Anagram Chain",
  },
  twitter: {
    card: "summary",
    title: "Anagram Chain — Daily Word Puzzle",
    description: "Unscramble 5 words in a chain. New chain every day.",
  },
};

export const viewport = {
  themeColor: "#0ea5e9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${dmSerif.variable} ${outfit.variable}`}>
        {children}
      </body>
    </html>
  );
}
