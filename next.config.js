/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
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
  experimental: {
    serverComponentsExternalPackages: ["@supabase/supabase-js"],
  },
}

module.exports = nextConfig
