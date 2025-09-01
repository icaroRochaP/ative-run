"use client"

import React from "react"
import Image from "next/image"
import CTAButton from "./CTAButton"

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-aleen-light via-white to-aleen-secondary/10 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-aleen-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-aleen-secondary/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col items-center justify-start min-h-screen text-center pt-4 sm:pt-6">
          {/* Logo */}
          <div className="mb-4 transform hover:scale-105 transition-transform duration-300">
            <Image
              src="/placeholder-logo.png"
              alt="Aleen.ai Logo"
              width={120}
              height={120}
              className="w-24 h-24 md:w-32 md:h-32 object-contain"
              priority
            />
          </div>
          
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight tracking-tight px-2">
            Your{" "}
            <span className="bg-gradient-to-r from-aleen-primary to-aleen-secondary bg-clip-text text-transparent">
              AI Fitness
            </span>
            <br />
            Coach is Here
          </h1>
          
          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl leading-relaxed font-medium px-4">
            Transform your health journey with personalized AI-generated workout plans, 
            nutrition guidance, and intelligent coaching that adapts to your goals, 
            preferences, and progress.
          </p>

          {/* Primary CTA */}
          <div className="mb-16">
            <CTAButton 
              variant="primary"
              size="lg"
              className="text-base sm:text-xl px-8 sm:px-12 py-4 sm:py-6 w-full sm:w-auto max-w-sm sm:max-w-none"
            >
              <span className="sm:hidden">Start AI Fitness Journey</span>
              <span className="hidden sm:inline">Start Your AI Fitness Journey</span>
            </CTAButton>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-gray-500 text-xs sm:text-sm px-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-aleen-primary rounded-full"></div>
              <span>AI-Powered Personalization</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-aleen-secondary rounded-full"></div>
              <span>WhatsApp Integration</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-aleen-purple rounded-full"></div>
              <span>Professional Dashboard</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
