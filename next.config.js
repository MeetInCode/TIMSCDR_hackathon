/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "https://timscdr-hackathon-git-main-meemeets-projects.vercel.app//api/:path*"
            : "/api/",
      },
    ];
  },
};

module.exports = nextConfig;
