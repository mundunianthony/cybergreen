import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { company, contact } from "@/data/content";
import "./globals.css";

/**
 * Two families, matching the logo's own duality: a warm serif for headlines
 * (grown) and a precise sans for body copy and figures (engineered).
 * Self-hosted by next/font, so there is no render-blocking request to Google.
 */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(contact.websiteHref),
  title: {
    default: `${company.tradingName} - ${company.tagline}`,
    template: `%s | ${company.tradingName}`,
  },
  description:
    "CyberGreen Engineering Solutions Co. Ltd delivers e-waste management, secure data destruction, online safety training and ICT consultancy across Uganda.",
  keywords: [
    "e-waste Uganda",
    "electronic waste recycling Kampala",
    "cybersecurity awareness Uganda",
    "online safety training",
    "secure data destruction",
    "ICT consultancy Uganda",
  ],
  openGraph: {
    type: "website",
    siteName: company.tradingName,
    title: `${company.tradingName} - ${company.tagline}`,
    description:
      "Responsible e-waste management and practical digital safety training for Uganda.",
    locale: "en_UG",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="rounded-card focus:text-canopy sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-sm"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
