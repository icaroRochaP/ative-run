import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { ErrorBoundary } from "@/lib/error-boundary"
import { Toaster } from "@/components/ui/toaster"
import Script from 'next/script'

const inter = Inter({ subsets: ["latin"] })

// Gerar um timestamp para evitar cache de assets
const cacheBreaker = Date.now()

export const metadata: Metadata = {
  title: "ATIVE - Fitness Inteligente",
  description: "Transforme sua jornada fitness com monitoramento inteligente, análises personalizadas e insights que se adaptam ao seu progresso.",
  generator: 'ATIVE',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  icons: {
    icon: `/favicon.ico?v=${cacheBreaker}`,
    shortcut: `/favicon.ico?v=${cacheBreaker}`,
    apple: `/favicon.png?v=${cacheBreaker}`,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Adicionar um timestamp como query param para evitar cache
  const timeStamp = Date.now()
  
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={`/favicon.ico?v=${timeStamp}`} sizes="any" />
        <link rel="icon" href={`/favicon.png?v=${timeStamp}`} type="image/png" />
        <link rel="apple-touch-icon" href={`/favicon.png?v=${timeStamp}`} />
        {/* Meta tags para prevenir cache */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>{children}</AuthProvider>
        </ErrorBoundary>
        <Toaster />
        {/* Script anti-cache para desenvolvimento */}
        <Script src={`/no-cache.js?v=${timeStamp}`} strategy="beforeInteractive" />
      </body>
    </html>
  )
}
