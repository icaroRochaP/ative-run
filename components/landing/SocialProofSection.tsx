"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Users, TrendingUp, Award, Quote } from "lucide-react"
import CTAButton from "./CTAButton"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Busy Professional",
    image: "/placeholder-user.jpg",
    content: "Aleen.ai transformed my fitness routine completely. Having an AI coach available 24/7 through WhatsApp means I never miss a workout, even with my crazy schedule.",
    rating: 5
  },
  {
    name: "Mike Rodriguez", 
    role: "Fitness Enthusiast",
    image: "/placeholder-user.jpg",
    content: "The personalized nutrition plans are incredible. The AI learned my preferences and dietary restrictions, creating meal plans I actually enjoy following.",
    rating: 5
  },
  {
    name: "Emma Chen",
    role: "Working Mom",
    image: "/placeholder-user.jpg", 
    content: "I love how the AI adapts to my energy levels and available time. Some days I get 45-minute workouts, other days just 15 minutes - but always effective!",
    rating: 5
  }
]

const stats = [
  {
    icon: Users,
    number: "10,000+",
    label: "Active Users",
    description: "People transforming their lives"
  },
  {
    icon: TrendingUp,
    number: "87%",
    label: "Success Rate", 
    description: "Users achieving their goals"
  },
  {
    icon: Award,
    number: "4.9/5",
    label: "User Rating",
    description: "Average satisfaction score"
  },
  {
    icon: Star,
    number: "50M+",
    label: "AI Interactions",
    description: "Personalized recommendations"
  }
]

const trustIndicators = [
  "AI-Powered Personalization",
  "Evidence-Based Protocols", 
  "Certified Fitness Science",
  "Privacy & Security First",
  "Continuous Learning Algorithm",
  "Expert-Backed Content"
]

export default function SocialProofSection() {
  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-aleen-primary to-aleen-secondary bg-clip-text text-transparent">
              Thousands
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join a community of successful individuals who have transformed their health 
            and fitness with AI-powered coaching.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-gradient-to-br from-aleen-light to-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-aleen-primary to-aleen-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {stat.number}
                </div>
                <div className="text-sm font-semibold text-gray-700 mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-gray-500">
                  {stat.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            What Our Users Say
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  {/* Quote Icon */}
                  <Quote className="h-8 w-8 text-aleen-primary mb-4" />
                  
                  {/* Rating */}
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  {/* Content */}
                  <p className="text-gray-600 mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  
                  {/* Author */}
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-aleen-primary to-aleen-secondary rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-gradient-to-r from-aleen-light to-white rounded-3xl p-8 md:p-12 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Why Trust Aleen.ai?
            </h3>
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Our AI technology is built on scientific foundations with user privacy and 
              results as our top priorities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="flex items-center">
                <div className="w-2 h-2 bg-aleen-primary rounded-full mr-3 flex-shrink-0"></div>
                <span className="text-gray-700 font-medium">{indicator}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tertiary CTA */}
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-6">
            Ready to join thousands of successful users?
          </p>
          <CTAButton 
            variant="primary"
            size="lg"
          >
            Start Your Success Story
          </CTAButton>
        </div>
      </div>
    </section>
  )
}
