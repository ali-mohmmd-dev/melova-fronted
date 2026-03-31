/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  compiler: {
    styledJsx: true,
  },

  output: 'export',

  images: {
    unoptimized: true,
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
      {
        protocol: "http",
        hostname: "api.mymelova.com",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "api.mymelova.com",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "developers.google.com",
      },
       {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
