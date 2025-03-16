/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ["v0.blob.com", "public.blob.vercel-storage.com"],
    },
    env: {
      BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    }
  }
  
  module.exports = nextConfig
  