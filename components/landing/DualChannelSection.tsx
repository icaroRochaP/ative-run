"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Monitor, Smartphone, BarChart3, Calendar, Zap, Users, Clock } from "lucide-react"

export default function DualChannelSection() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-aleen-light/50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Two Powerful Ways to{" "}
            <span className="bg-gradient-to-r from-aleen-primary to-aleen-secondary bg-clip-text text-transparent">
              Stay Connected
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Access your AI fitness coach anywhere via WhatsApp or dive deep into your progress 
            with our comprehensive dashboard. Both channels work seamlessly together.
          </p>
        </div>

        {/* Dual Channel Cards */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* WhatsApp Channel */}
          <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden group">
            <CardContent className="p-8 lg:p-12">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  WhatsApp Convenience
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Chat with your AI coach anytime, anywhere. Get instant workout guidance, 
                  nutrition tips, and motivation right in your pocket.
                </p>
              </div>

              {/* WhatsApp Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Smartphone className="h-5 w-5 text-green-500 mr-4 flex-shrink-0" />
                  <span className="text-gray-700">Instant workout modifications on-the-go</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-green-500 mr-4 flex-shrink-0" />
                  <span className="text-gray-700">Quick nutrition questions and meal suggestions</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-green-500 mr-4 flex-shrink-0" />
                  <span className="text-gray-700">24/7 motivation and accountability check-ins</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-green-500 mr-4 flex-shrink-0" />
                  <span className="text-gray-700">Easy progress logging via voice or text</span>
                </div>
              </div>

              {/* WhatsApp Mockup */}
              <div className="bg-gray-100 rounded-2xl p-6">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                    <span className="font-semibold text-gray-800">Aleen.ai Coach</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <p className="text-gray-700">"I'm at the gym but the equipment I need is busy. Any alternatives?"</p>
                    </div>
                    <div className="bg-green-500 text-white rounded-lg p-3 ml-8">
                      <p>Great question! Here are 3 effective alternatives for your chest workout: 1) Push-ups (3x12), 2) Dumbbell flyes (3x10), 3) Cable crossovers (3x12). Would you like detailed form tips? 💪</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dashboard Channel */}
          <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden group">
            <CardContent className="p-8 lg:p-12">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-aleen-primary to-aleen-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Monitor className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  Dashboard Power
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Dive deep into your fitness journey with comprehensive tracking, 
                  detailed analytics, and advanced planning tools.
                </p>
              </div>

              {/* Dashboard Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-aleen-primary mr-4 flex-shrink-0" />
                  <span className="text-gray-700">Detailed progress analytics and trends</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-aleen-primary mr-4 flex-shrink-0" />
                  <span className="text-gray-700">Advanced workout and meal planning</span>
                </div>
                <div className="flex items-center">
                  <Monitor className="h-5 w-5 text-aleen-primary mr-4 flex-shrink-0" />
                  <span className="text-gray-700">Video exercise library and form guides</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-aleen-primary mr-4 flex-shrink-0" />
                  <span className="text-gray-700">Goal setting and achievement tracking</span>
                </div>
              </div>

              {/* Dashboard Mockup */}
              <div className="bg-gray-100 rounded-2xl p-6">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-aleen-primary/10 rounded-lg p-3 text-center">
                      <BarChart3 className="h-6 w-6 text-aleen-primary mx-auto mb-2" />
                      <p className="text-xs font-semibold text-gray-700">Progress</p>
                      <p className="text-sm font-bold text-aleen-primary">+15%</p>
                    </div>
                    <div className="bg-aleen-secondary/10 rounded-lg p-3 text-center">
                      <Calendar className="h-6 w-6 text-aleen-secondary mx-auto mb-2" />
                      <p className="text-xs font-semibold text-gray-700">Streak</p>
                      <p className="text-sm font-bold text-aleen-secondary">12 days</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-aleen-primary to-aleen-secondary rounded-lg p-3 text-white text-center">
                    <p className="text-xs font-semibold">Today's Workout</p>
                    <p className="text-sm">Upper Body Strength</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integration Benefits */}
        <div className="bg-gradient-to-r from-aleen-primary to-aleen-secondary rounded-3xl p-8 lg:p-12 text-white text-center">
          <h3 className="text-2xl lg:text-3xl font-bold mb-6">
            Seamlessly Integrated Experience
          </h3>
          <p className="text-lg mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
            Your WhatsApp conversations and dashboard data sync automatically. 
            Log workouts via chat, view detailed analytics on your dashboard, 
            and get the best of both worlds.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <Zap className="h-8 w-8 mx-auto mb-3" />
              <h4 className="font-bold mb-2">Instant Sync</h4>
              <p className="text-sm opacity-90">Real-time data synchronization across platforms</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <Users className="h-8 w-8 mx-auto mb-3" />
              <h4 className="font-bold mb-2">Unified Experience</h4>
              <p className="text-sm opacity-90">Consistent AI coaching regardless of platform</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <BarChart3 className="h-8 w-8 mx-auto mb-3" />
              <h4 className="font-bold mb-2">Complete Picture</h4>
              <p className="text-sm opacity-90">Holistic view of your fitness journey</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
