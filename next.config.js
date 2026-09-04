/** @type {import('next').NextConfig} */
let customSupabaseHost = 'qzbmctgbyinwyqxemzod.supabase.co';
try {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    customSupabaseHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname;
  }
} catch {
  // fallback if URL is empty during build
}

const nextConfig = {
  pageExtensions: ['page.jsx', 'page.js'],
  reactStrictMode: false,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: customSupabaseHost,
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.externals.push('sharp');
    }
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
    });

    return config;
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ],
  redirects: async () => [
    {
      source: '/home',
      destination: '/',
      permanent: true,
    },
  ],
};

module.exports = nextConfig;
