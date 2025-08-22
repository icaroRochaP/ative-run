"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Target, Dumbbell, Apple, Users, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-aleen-light via-white to-aleen-light">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-aleen-primary to-aleen-secondary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <Heart className="h-16 w-16 text-white" />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-aleen-primary to-aleen-secondary bg-clip-text text-transparent mb-6 tracking-tight">
            Aleen.ai
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl leading-relaxed font-medium">
            Transforme sua jornada de saúde com planos personalizados de treino, 
            orientação nutricional e coaching inteligente com IA.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 mb-12">
            <Link href="/onboarding">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-aleen-primary to-aleen-secondary hover:from-aleen-secondary hover:to-aleen-primary text-white text-lg px-10 py-5 font-bold shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl"
              >
                Começar Jornada
              </Button>
            </Link>
            
            <Link href="/auth/signin">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-3 border-aleen-primary text-aleen-primary hover:bg-aleen-primary hover:text-white text-lg px-10 py-5 font-bold transition-all duration-300 rounded-2xl"
              >
                Entrar
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-aleen-primary to-aleen-secondary bg-clip-text text-transparent text-center mb-16">
            Tudo que você precisa para ter sucesso
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-3xl overflow-hidden">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-aleen-primary to-aleen-secondary rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Planos Personalizados</h3>
                <p className="text-gray-600 leading-relaxed">
                  Planos de treino e nutrição com IA adaptados especificamente aos seus objetivos, 
                  nível de condicionamento e preferências.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-3xl overflow-hidden">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-aleen-secondary to-aleen-purple rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Dumbbell className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Treino Inteligente</h3>
                <p className="text-gray-600 leading-relaxed">
                  Treinos progressivos que se adaptam ao seu progresso, com instruções 
                  detalhadas e demonstrações em vídeo.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-3xl overflow-hidden">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-aleen-purple to-aleen-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Apple className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Orientação Nutricional</h3>
                <p className="text-gray-600 leading-relaxed">
                  Planos alimentares personalizados, controle de calorias e orientação 
                  nutricional para potencializar seus resultados.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 px-4 bg-gradient-to-r from-aleen-primary to-aleen-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-16">
            Junte-se a milhares que transformaram suas vidas
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="flex items-center space-x-4 text-left">
              <CheckCircle className="h-8 w-8 text-aleen-light flex-shrink-0" />
              <span className="text-white text-xl font-medium">Planos de treino personalizados</span>
            </div>
            <div className="flex items-center space-x-4 text-left">
              <CheckCircle className="h-8 w-8 text-aleen-light flex-shrink-0" />
              <span className="text-white text-xl font-medium">Acompanhamento de progresso e análises</span>
            </div>
            <div className="flex items-center space-x-4 text-left">
              <CheckCircle className="h-8 w-8 text-aleen-light flex-shrink-0" />
              <span className="text-white text-xl font-medium">Coach de fitness com IA 24/7</span>
            </div>
            <div className="flex items-center space-x-4 text-left">
              <CheckCircle className="h-8 w-8 text-aleen-light flex-shrink-0" />
              <span className="text-white text-xl font-medium">Planos nutricionais customizados</span>
            </div>
          </div>

          <Link href="/onboarding">
            <Button 
              size="lg" 
              className="bg-white text-aleen-primary hover:bg-aleen-light text-2xl px-12 py-6 font-bold shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl"
            >
              Comece Hoje
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-aleen-primary to-aleen-secondary rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <p className="text-gray-600 mb-4 font-medium">
            © 2025 Aleen.ai. Seu companheiro pessoal de saúde inteligente.
          </p>
          <div className="flex justify-center space-x-6">
            <Link href="/auth/signin" className="text-aleen-secondary hover:text-aleen-primary transition-colors font-medium">
              Entrar
            </Link>
            <Link href="/onboarding" className="text-aleen-secondary hover:text-aleen-primary transition-colors font-medium">
              Começar
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
