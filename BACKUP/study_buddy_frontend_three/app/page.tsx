"use client"

import { ChalkboardLayout } from "@/components/chalkboard-layout"
import {
  HeroSection,
  LifecycleTimeline,
  FeaturePinboard,
  Footer,
} from "@/components/landing-sections"

export default function LandingPage() {
  return (
    <ChalkboardLayout>
      <HeroSection />
      <LifecycleTimeline />
      <FeaturePinboard />
      <Footer />
    </ChalkboardLayout>
  )
}
