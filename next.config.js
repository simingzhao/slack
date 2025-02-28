/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Replace all Node.js only modules with empty objects
      config.resolve.alias = {
        ...config.resolve.alias,
        // Packages that should be server-only
        'postgres': false,
        'drizzle-orm': false,
        '@/db/db': false,
        '@/lib/server-db': false,
      };
    }
    
    return config;
  },
  // Make sure postgres only runs on the server
  experimental: {
    // Explicitly mark packages that should be treated as server-only
    serverComponentsExternalPackages: ['postgres', 'drizzle-orm'],
    // Optimize server actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

module.exports = nextConfig; 