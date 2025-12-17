'use client'

import { Hero } from '@/components/home/hero'
import { TechStack } from '@/components/home/tech-stack'
import { Features } from '@/components/home/features'
import { HowToUse } from '@/components/home/how-to-use'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <TechStack />
      <Features />
      <HowToUse />
    </div>
  )
}
