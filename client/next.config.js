/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hyperioncrm.s3.us-east-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "external.fagc3-2.fna.fbcdn.net",
      },
      { protocol: "https", hostname: "scontent-lga3-1.xx.fbcdn.net" },
      { protocol: "https", hostname: "scontent-lga3-2.xx.fbcdn.net" },
    ],
  },
  async headers() {
    return [
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "content-type",
            value: "text/xml;application/xml;text/html;",
            // value: "text/plain;charset=UTF-8",
          },
        ],
      },
    ];
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
