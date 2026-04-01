import type { NextConfig } from "next";

const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;
const allowedDevOrigins = redirectUri ? [new URL(redirectUri).host] : [];

const nextConfig: NextConfig = {
  allowedDevOrigins
};

export default nextConfig;
