/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/voice/(.*)",
        headers: [
          {
            key: "content-type",
            value: "text/xml;application/xml;text/html",
          },
        ],
        source: "/api/voice",
        headers: [
          {
            key: "content-type",
            value: "text/xml;application/xml;text/html",
          },
        ],
        // source: "/api/(.*)",
        // headers: [
        //   {
        //     key: "content-type",
        //     value: "text/xml;application/xml;text/html",
        //   },
        // ],
      },
    ];
  },
};

module.exports = nextConfig;
