import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF primero (mejor compresión para fotos); WebP como fallback.
    // En Vercel, next/image genera y cachea estos formatos según el `sizes`.
    formats: ["image/avif", "image/webp"],
    // Bucket público de Cloudflare R2 donde viven los comprobantes.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-412ae4b363dd4ebaafbc64e4c8ee141e.r2.dev",
      },
    ],
  },
};

export default nextConfig;
