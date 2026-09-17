import type { NextConfig } from "next";

const redirects = {
  resume: "https://drive.google.com/file/d/14qC6XnWvTeUPBztT8AquxQZzKh-wQCbr/view?usp=sharing",
  linkedin: "https://www.linkedin.com/in/adaliea",
  yt: "https://www.youtube.com/c/DaCubeKing",
};

const nextConfig: NextConfig = {
  agentRules: false,
  allowedDevOrigins: process.env.DEV_ALLOWED_ORIGINS?.split(",").map((origin) => origin.trim()),
  images: { unoptimized: true },
  async redirects() {
    return [
      ...Object.entries(redirects).flatMap(([source, destination]) =>
        [source, `${source}.html`].map((path) => ({
          source: `/${path}`,
          destination,
          permanent: true,
        })),
      ),
      ...[
        "projects",
        "archive",
        "reading",
        "blankfiller",
        "readingedit/reading",
        "readingedit/editTitle",
        "readingedit/updateProgress",
      ].map((path) => ({
        source: `/${path}.html`,
        destination: `/${path}`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
