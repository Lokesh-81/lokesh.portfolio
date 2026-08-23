import type React from "react"
import type { Metadata, Viewport } from "next"
import { Figtree } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Instrument_Serif } from "next/font/google"
import { PortfolioProvider } from "@/lib/portfolio-context"
import "./globals.css"

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-figtree",
  display: "swap",
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
})

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  title: "P.Lokesh | Web Developer",
  description:
    "P. Lokesh — Full Stack Developer & AI Enthusiast based in Hyderabad, India. Building modern web applications, scalable platforms, and AI-powered products.",
  keywords: [
    "P. Lokesh",
    "Lokesh Poosala",
    "Full Stack Developer",
    "Web Developer",
    "AI Enthusiast",
    "Hyderabad",
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Lumora AI",
    "BELVO",
    "Naivaidya",
    "Foundarly"
  ],
  authors: [{ name: "P. Lokesh", url: "https://github.com/Lokesh-81" }],
  creator: "P. Lokesh",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" }
    ],
    apple: [{ url: "/icon.svg" }]
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lokeshportfolio-pink.vercel.app",
    title: "P.Lokesh | Web Developer",
    description:
      "Full Stack Developer & AI Enthusiast based in Hyderabad. Explore selected production projects, engineering experience, and digital experiments.",
    siteName: "P. Lokesh Portfolio"
  },
  twitter: {
    card: "summary_large_image",
    title: "P.Lokesh | Web Developer",
    description:
      "Full Stack Developer & AI Enthusiast based in Hyderabad. Modern web applications, scalable platforms & AI digital products.",
    creator: "@lokesh_poosala"
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <style>{`
html {
  font-family: ${figtree.style.fontFamily};
  --font-sans: ${figtree.variable};
  --font-mono: ${GeistMono.variable};
  --font-instrument-serif: ${instrumentSerif.variable};
}
        `}</style>
      </head>
      <body className={`${figtree.variable} ${instrumentSerif.variable} antialiased bg-black text-white selection:bg-purple-500/30 selection:text-purple-200`}>
        <PortfolioProvider>
          {children}
        </PortfolioProvider>
      </body>
    </html>
  )
}
