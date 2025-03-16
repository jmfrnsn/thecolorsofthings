/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ["v0.blob.com", "public.blob.vercel-storage.com"],
    },
    env: {
      BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    },
    webpack: (config, { isServer }) => {
      config.module.rules.push({
        test: /\.(mp3)$/,
        type: 'asset/resource'
      })
      return config
    }
  }
  
  module.exports = nextConfig
  