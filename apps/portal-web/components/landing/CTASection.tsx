"use client"

import React from "react"
import Image from "next/image"
import CTAButton from "./CTAButton"
import { ArrowRight, CheckCircle, Zap } from "lucide-react"

export default function CTASection() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-r from-aleen-primary to-aleen-secondary relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          {/* Main CTA Headline */}
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight px-4">
            Your AI Fitness Coach
            <br />
            <span className="text-aleen-light">Awaits You</span>
          </h2>
          
          {/* Supporting Text */}
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            Join thousands who have already transformed their lives with personalized AI coaching. 
            Start your journey today - it only takes 30 seconds to begin.
          </p>

          {/* Benefits Highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 max-w-4xl mx-auto">
            <div className="flex items-center justify-center sm:justify-start text-white">
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-aleen-light mr-3 flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base">Instant WhatsApp Access</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start text-white">
              <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-aleen-light mr-3 flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base">AI-Powered Personalization</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start text-white">
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-aleen-light mr-3 flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base">Results in 30 Days</span>
            </div>
          </div>
          
          {/* Final CTA Button */}
          <div className="mb-8 px-4">
            <CTAButton 
              variant="outline"
              size="lg"
              className="w-full sm:w-auto max-w-sm sm:max-w-none mx-auto font-bold shadow-2xl"
            >
              <span className="sm:hidden">Transform Your Life</span>
              <span className="hidden sm:inline">Transform Your Life Now</span>
            </CTAButton>
          </div>
          
          {/* Urgency/Scarcity */}
          <p className="text-aleen-light/80 text-xs sm:text-sm px-4">
            Free consultation • No credit card required • Start in 30 seconds
          </p>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-20 pt-12 border-t border-white/20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <div className="mr-3">
                <Image
                  src="/placeholder-logo.png"
                  alt="Aleen.ai Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <span className="text-white font-bold text-xl">Aleen.ai</span>
            </div>
            <p className="text-white/70 mb-6">
              Your intelligent fitness companion, available 24/7 through WhatsApp
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-white/60 text-sm">
              <span>© 2025 Aleen.ai. All rights reserved.</span>
              <div className="flex gap-6">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}
