/** @type {import('next').NextConfig} */
const backendUrl = process.env.API_BACKEND_URL || "http://localhost:8000";

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.veev-vape.com" },
      { protocol: "https", hostname: "media.iqos.com" },
      { protocol: "https", hostname: "www.bullbrand.co.uk" },
      { protocol: "https", hostname: "**.bullbrand.co.uk" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
