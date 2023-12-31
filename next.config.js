/** @type {import('next').NextConfig} */

module.exports = {
  /* ...기존 설정... */
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.extensions.push('.scss');
    }
    return config;
  },
};