/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'export',
  images: {
    unoptimized: true,
  },
  // ... 다른 설정들
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })
    return config
  },
};

// 환경 변수에 따라 번들 분석기를 조건부로 활성화
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  ...nextConfig,
  
  // 이미지 최적화
  images: {
    domains: ['i.imgur.com'], // 외부 이미지 도메인 추가
    formats: ['image/avif', 'image/webp'],
    loader: 'custom',
    loaderFile: './imageLoader.js',
  },
  
  // 정적 페이지 생성 최적화
  experimental: {
    optimizeCss: true,
  },
})
