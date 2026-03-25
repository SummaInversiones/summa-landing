'use client'

import { Nav } from '@/components/Nav'
import { Hero } from '@/components/Hero'
import { ProblemSolution } from '@/components/ProblemSolution'
import { HowItWorks } from '@/components/HowItWorks'
import { TrustSection } from '@/components/TrustSection'
import { Benefits } from '@/components/Benefits'
import { FAQ } from '@/components/FAQ'
import { FooterCTA } from '@/components/FooterCTA'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function Home() {
  useScrollReveal()

  return (
    <main>
      <Nav />
      <Hero />
      <ProblemSolution />
      <HowItWorks />
      <TrustSection />
      <Benefits />
      <FAQ />
      <FooterCTA />
    </main>
  )
}
