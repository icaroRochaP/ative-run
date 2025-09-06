/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    // Adicionar um timestamp dinâmico que muda a cada execução para forçar novas builds
    BUILD_TIMESTAMP: Date.now().toString(),
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Enable detailed error reporting
  serverExternalPackages: ["@supabase/supabase-js"],
  // Configurações para prevenir cache durante desenvolvimento
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0, must-revalidate'
          },
          {
            key: 'Pragma',
            value: 'no-cache'
          },
          {
            key: 'Expires',
            value: '0'
          }
        ],
      },
    ]
  },
  // Desabilitar compressão para desenvolvimento
  compress: process.env.NODE_ENV !== 'development',
  // Gerar IDs únicos para cada build em desenvolvimento
  generateBuildId: async () => {
    if (process.env.NODE_ENV === 'development') {
      return `dev-${Date.now()}`
    }
    return 'production-build'
  }
}

module.exports = nextConfig
