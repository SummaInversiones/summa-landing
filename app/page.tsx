'use client'

import { Nav } from '@/components/Nav'
import { Hero } from '@/components/Hero'
import { ProblemCards } from '@/components/ProblemCards'
import { HowItWorks } from '@/components/HowItWorks'
import { SocialProof } from '@/components/SocialProof'
import { FooterCTA } from '@/components/FooterCTA'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function Home() {
  useScrollReveal()

  return (
    <main>
      <Nav />
      <Hero />
      <ProblemCards />
      <HowItWorks />
      <SocialProof />
      <FooterCTA />
    </main>
  )
}
