const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: true,
   i18n,
   // Enable custom server for Socket.IO
   webpack: (config) => {
      config.externals.push({
         'utf-8-validate': 'commonjs utf-8-validate',
         'bufferutil': 'commonjs bufferutil',
      });
      return config;
   },
};

module.exports = nextConfig;
