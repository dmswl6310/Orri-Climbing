import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 외부 이미지 최적화를 위해 허용
  images: {
    remotePatterns: [
      // {
      //   protocol: 'https',
      //   hostname: '**.photos.com', // 특정 도메인의 모든 서브도메인 허용
      // },
      {
        protocol: "https",
        hostname: "**", //
      },
    ],
  },
};

export default nextConfig;
