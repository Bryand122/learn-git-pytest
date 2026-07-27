import type { NextConfig } from "next";

// On GitHub Pages the app is served from
// https://<user>.github.io/learn-git-pytest/, hence the base path.
const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  // Fully static app — exported as plain HTML/JS, deployable anywhere.
  output: "export",
  basePath: isGitHubPages ? "/learn-git-pytest" : undefined,
  images: { unoptimized: true },
};

export default nextConfig;
