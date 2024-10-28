/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // static export를 위해 필요
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: true,
  // ... 다른 설정들
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })
    return config
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ]
  },
};

// 환경 변수에 따라 번들 분석기를 조건부로 활성화
const withBundleAnalyzer = process.env.ANALYZE === 'true'
  ? require('@next/bundle-analyzer')()
  : (config) => config;

module.exports = withBundleAnalyzer({
  ...nextConfig,
  // webpack 설정을 단순화
  webpack: (config, { dev, isServer }) => {
    // nextConfig의 webpack 설정을 먼저 적용
    if (typeof nextConfig.webpack === 'function') {
      config = nextConfig.webpack(config, { dev, isServer });
    }

    // 프로덕션 빌드에서만 최적화 적용
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
            },
          },
        },
      };
    }

    return config;
  },
});
