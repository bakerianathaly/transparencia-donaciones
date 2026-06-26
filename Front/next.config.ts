import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF primero (mejor compresión para fotos); WebP como fallback.
    // En Vercel, next/image genera y cachea estos formatos según el `sizes`.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
