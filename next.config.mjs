// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true, // ativa suporte a styled-components no SWC
  },
};

export default nextConfig;
