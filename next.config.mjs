/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          source: "/(.*)", // Apply to all routes
          headers: [
            {
              key: "Access-Control-Allow-Origin",
              value: process.env.NEXT_PUBLIC_BASE_URL, // Change to your allowed domain(s)
            },
            {
              key: "Access-Control-Allow-Methods",
              value: "GET, POST, PUT, DELETE, OPTIONS",
            },
            {
              key: "Access-Control-Allow-Headers",
              value: "X-Requested-With, Content-Type, Authorization",
            },
            {
              key: "Access-Control-Allow-Credentials",
              value: "true", // Allow credentials
            },
          ],
        },
      ];
    },
  };

export default nextConfig;
