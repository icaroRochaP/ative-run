"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, User, Zap, BarChart3, ArrowRight, CheckCircle } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: MessageCircle,
    title: "Connect via WhatsApp",
    description: "Simply click our WhatsApp button and send a message to Aleen.ai. No app downloads or complicated sign-ups required.",
    details: ["Instant connection", "No registration needed", "Available 24/7"]
  },
  {
    number: "02", 
    icon: User,
    title: "Share Your Goals",
    description: "Tell Aleen about your fitness goals, current level, preferences, and any restrictions. Our AI listens and learns.",
    details: ["Personalized assessment", "Goal setting", "Preference mapping"]
  },
  {
    number: "03",
    icon: Zap,
    title: "Get AI-Generated Plans",
    description: "Receive custom workout and nutrition plans created specifically for you. Everything delivered directly to WhatsApp.",
    details: ["Custom workout plans", "Nutrition guidance", "Instant delivery"]
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Track & Improve",
    description: "Monitor your progress through WhatsApp or access detailed analytics in your personal dashboard for deeper insights.",
    details: ["Progress tracking", "Dashboard access", "Continuous optimization"]
  }
]

export default function HowItWorksSection() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-aleen-light/50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            How{" "}
            <span className="bg-gradient-to-r from-aleen-primary to-aleen-secondary bg-clip-text text-transparent">
              It Works
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get started with your AI fitness coach in minutes. Simple, fast, and effective - 
            no complex setup required.
          </p>
        </div>

        {/* Steps Flow */}
        <div className="relative">
          <div className="grid lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Mobile Arrow */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-aleen-primary rotate-90" />
                  </div>
                )}
                
                <Card className="bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-3xl overflow-visible relative mt-8">
                  <CardContent className="p-6 sm:p-8 text-center relative">
                    {/* Step Number - Repositioned to be completely visible */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-aleen-primary to-aleen-secondary rounded-full flex items-center justify-center shadow-lg border-4 border-white z-10">
                      <span className="text-white font-bold text-base">{step.number}</span>
                    </div>
                    
                    {/* Icon */}
                    <div className="w-16 h-16 bg-gradient-to-br from-aleen-secondary/20 to-aleen-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 mt-8">
                      <step.icon className="h-8 w-8 text-aleen-primary" />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4">
                      {step.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                      {step.description}
                    </p>
                    
                    {/* Details List */}
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start justify-center text-xs sm:text-sm text-gray-700">
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-aleen-primary mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-left">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Flow Summary */}
        <div className="mt-16 bg-white rounded-3xl p-8 md:p-12 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              From WhatsApp to Results
            </h3>
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Experience seamless integration between WhatsApp convenience and powerful dashboard insights. 
              Your fitness journey, simplified.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-10 w-10 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">WhatsApp Chat</h4>
              <p className="text-sm text-gray-600">Quick access anywhere</p>
            </div>
            
            <div className="flex justify-center">
              <ArrowRight className="h-8 w-8 text-aleen-primary hidden md:block" />
              <ArrowRight className="h-6 w-6 text-aleen-primary rotate-90 md:hidden" />
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-aleen-primary to-aleen-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-10 w-10 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Dashboard Insights</h4>
              <p className="text-sm text-gray-600">Detailed analytics & tracking</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
