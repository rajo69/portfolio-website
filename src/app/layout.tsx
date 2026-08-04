import type { Metadata, Viewport } from "next";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";

import { AttentionField } from "@/components/layout/AttentionField";
import { CursorRing } from "@/components/layout/CursorRing";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { profile } from "@/content/profile";

import "./globals.css";

/* Self-hosted by next/font, no external requests, no CLS.
   See DESIGN.md §4 for why these three. */
const display = Archivo({
  variable: "--ff-display",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const sans = Inter({
  variable: "--ff-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--ff-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.meta.siteUrl),
  title: {
    default: `${profile.name} · ${profile.title}`,
    template: `%s · ${profile.name}`,
  },
  description: profile.meta.description,
  authors: [{ name: profile.name, url: profile.socials.github }],
  openGraph: {
    type: "website",
    siteName: profile.name,
    title: `${profile.name} · ${profile.title}`,
    description: profile.meta.description,
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#08090a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-GB"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      {/* No height on <html> or <body>. Lenis observes documentElement with a
          ResizeObserver, so pinning it to 100% means the observer never fires
          and the scroll limit stays frozen at whatever the first page measured.
          The sticky footer comes from min-h-screen on the flex column below. */}
      <body className="relative">
        {/* Ambient layer, fixed, behind everything, pointer-transparent. */}
        <AttentionField />

        <SmoothScroll />
        <ScrollProgress />
        <CursorRing />

        {/* Keyboard users land here first. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-accent focus:px-5 focus:py-2 focus:text-sm focus:font-medium focus:text-on-accent"
        >
          Skip to content
        </a>

        <div className="relative z-10 flex min-h-screen flex-col">
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
