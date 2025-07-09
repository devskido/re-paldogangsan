/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Exclude dynamic routes from static export
  exportPathMap: async function (defaultPathMap) {
    // Remove dynamic category pages
    const paths = Object.keys(defaultPathMap).filter(
      path => !path.includes('[slug]')
    );
    
    const pathMap = {};
    paths.forEach(path => {
      pathMap[path] = defaultPathMap[path];
    });
    
    // Add specific category pages if needed
    const categories = ['농산물', '수산물', '가공식품', '전통식품'];
    categories.forEach(category => {
      const slug = encodeURIComponent(category);
      pathMap[`/category/${slug}`] = { page: '/category/[slug]', query: { slug } };
    });
    
    return pathMap;
  },
}

module.exports = nextConfig