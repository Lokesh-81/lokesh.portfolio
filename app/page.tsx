"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import PortfolioShell from "@/components/portfolio-shell"

export default function HomePage() {
  return (
    <PortfolioShell noScroll hideFooter className="flex items-center">
      <div className="w-full">
        {/* Hero Section Only */}
        <section className="max-w-4xl py-4 md:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Sub-label */}
            <p className="mb-3 text-xs uppercase tracking-[0.28em] text-purple-300/80 font-medium">
              FULL STACK DEVELOPER / AI ENTHUSIAST
            </p>

            {/* Main Display Heading */}
            <h1 className="text-balance text-6xl font-light leading-[0.92] tracking-[-0.06em] text-white md:text-8xl lg:text-[6.5rem]">
              <span className="font-medium italic instrument">P.</span> Lokesh
            </h1>

            {/* Supporting Copy */}
            <p className="mt-7 max-w-2xl text-pretty text-base leading-relaxed text-white/70 md:text-lg">
              Engineering high-performance web applications, scalable digital platforms, and AI-powered products from Hyderabad, India. Focused on pristine craft, type safety, and real-world execution.
            </p>

            {/* Action Buttons */}
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/work"
                className="group flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-xs font-semibold text-black transition-all duration-200 hover:bg-white/85 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                <span>Explore my work</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-white/20 px-6 py-3.5 text-xs font-medium text-white/90 transition-all duration-200 hover:border-white/50 hover:bg-white/10 hover:text-white"
              >
                More about me
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-white/20 px-6 py-3.5 text-xs font-medium text-white/90 transition-all duration-200 hover:border-white/50 hover:bg-white/10 hover:text-white"
              >
                Get in touch
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </PortfolioShell>
  )
}

