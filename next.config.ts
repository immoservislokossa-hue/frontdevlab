/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    // ✅ Nouvelle méthode (plus besoin de "domains")
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.act.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'vnwvursnliuooepvdlnx.supabase.co', // ✅ ton bucket Supabase
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],

    dangerouslyAllowSVG: true,

    // ✅ Politique CSP corrigée (plus permissive pour Next.js)
    contentSecurityPolicy:
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'; " +
      "img-src * blob: data:; " +
      "media-src *; " +
      "connect-src *; " +
      "style-src 'self' 'unsafe-inline'; " +
      "font-src 'self' data:; " +
      "sandbox;",
  },

  // ✅ Configuration dev (évite le warning “cross origin detected”)
  experimental: {
    allowedDevOrigins: ['http://localhost:3000'],
  },

  // ✅ Log complet utile pour suivre les requêtes en dev
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

module.exports = nextConfig
