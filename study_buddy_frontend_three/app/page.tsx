"use client"

import { useState } from "react"
import { ChalkboardLayout } from "@/components/chalkboard-layout"
import { SplashScreen } from "@/components/splash-screen"
import {
  HeroSection,
  LifecycleTimeline,
  FeaturePinboard,
  Footer,
} from "@/components/landing-sections"

export default function LandingPage() {
  const [showSplash, setShowSplash] = useState(true)

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />
  }

  return (
    <ChalkboardLayout>
      <HeroSection />
      <LifecycleTimeline />
      <FeaturePinboard />
      <Footer />
    </ChalkboardLayout>
  )
}
