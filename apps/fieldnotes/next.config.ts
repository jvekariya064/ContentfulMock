import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The shared package ships TypeScript source rather than a build step.
  transpilePackages: ['@blog/contentful'],
  images: {
    // Contentful does the resizing; see src/image-loader.ts.
    loader: 'custom',
    loaderFile: './src/image-loader.ts',
  },
};

export default nextConfig;
