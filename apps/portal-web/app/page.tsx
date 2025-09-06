"use client"

import React from "react"
import HeroSection from "@/components/landing/HeroSection"
import FeaturesSection from "@/components/landing/FeaturesSection"
import DualChannelSection from "@/components/landing/DualChannelSection"
import HowItWorksSection from "@/components/landing/HowItWorksSection"
import SocialProofSection from "@/components/landing/SocialProofSection"
import CTASection from "@/components/landing/CTASection"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-ative-light">
      <HeroSection />
      <FeaturesSection />
      <DualChannelSection />
      <HowItWorksSection />
      <SocialProofSection />
      <CTASection />
    </main>
  )
}
