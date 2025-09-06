"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Dumbbell, Apple, Brain, Target, Zap, Users } from "lucide-react"
import CTAButton from "./CTAButton"

const features = [
  {
    icon: Dumbbell,
    title: "AI-Generated Workout Plans",
    description: "Personalized training programs that adapt to your fitness level, goals, and available equipment. Our AI analyzes your progress and adjusts intensity automatically.",
    benefits: ["Progressive overload optimization", "Exercise variety and rotation", "Injury prevention protocols", "Real-time form corrections"]
  },
  {
    icon: Apple,
    title: "Smart Nutrition Planning",
    description: "Custom meal plans and nutrition guidance tailored to your dietary preferences, restrictions, and fitness goals. Track macros effortlessly with AI assistance.",
    benefits: ["Macro-balanced meal suggestions", "Dietary restriction compliance", "Calorie tracking automation", "Supplement recommendations"]
  },
  {
    icon: Brain,
    title: "Intelligent Personalization",
    description: "Advanced AI that learns from your preferences, progress, and lifestyle to continuously optimize your fitness and nutrition journey for maximum results.",
    benefits: ["Adaptive learning algorithms", "Lifestyle integration", "Goal achievement tracking", "Behavioral pattern analysis"]
  }
]

export default function FeaturesSection() {
  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 px-4">
            Powered by{" "}
            <span className="bg-gradient-to-r from-aleen-primary to-aleen-secondary bg-clip-text text-transparent">
              Advanced AI
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Experience the future of fitness with AI technology that understands your unique needs 
            and creates personalized solutions that evolve with your progress.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-3xl overflow-hidden group">
              <CardContent className="p-8">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-aleen-primary to-aleen-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                
                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed text-center">
                  {feature.description}
                </p>
                
                {/* Benefits List */}
                <ul className="space-y-3">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-sm text-gray-700">
                      <div className="w-2 h-2 bg-aleen-primary rounded-full mr-3 flex-shrink-0"></div>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Technology Showcase */}
        <div className="bg-gradient-to-r from-aleen-light to-white rounded-3xl p-8 md:p-12 mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Why Choose AI-Powered Fitness?
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Traditional one-size-fits-all programs don't work. Our AI creates truly personalized 
                experiences that adapt in real-time to your progress, preferences, and lifestyle changes.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Target className="h-5 w-5 text-aleen-primary mr-3" />
                  <span className="text-gray-700 font-medium">Goal-Oriented</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-aleen-secondary mr-3" />
                  <span className="text-gray-700 font-medium">Real-Time Adaptation</span>
                </div>
                <div className="flex items-center">
                  <Brain className="h-5 w-5 text-aleen-purple mr-3" />
                  <span className="text-gray-700 font-medium">Continuous Learning</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-aleen-primary mr-3" />
                  <span className="text-gray-700 font-medium">Expert-Backed</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="w-full h-64 bg-gradient-to-br from-aleen-secondary/20 to-aleen-primary/20 rounded-2xl flex items-center justify-center">
                <Brain className="h-24 w-24 text-aleen-primary opacity-60" />
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-aleen-secondary rounded-full flex items-center justify-center shadow-lg">
                <Zap className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary CTA */}
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-6">
            Ready to experience AI-powered fitness coaching?
          </p>
          <CTAButton 
            variant="secondary"
            size="lg"
          >
            Discover Your AI Coach
          </CTAButton>
        </div>
      </div>
    </section>
  )
}
