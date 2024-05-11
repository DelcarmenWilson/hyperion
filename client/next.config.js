/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

module.exports = nextConfig;
