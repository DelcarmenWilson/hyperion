/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "",
        port: "3000",
        pathname: "C:/fakepath/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/api/voice",
        headers: [
          {
            key: "content-type",
            value: "text/xml;application/xml;text/html",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
