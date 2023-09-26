/** @type {import('next').NextConfig} */
const nextConfig = {}

const withPWA = require('next-pwa')({
    dest: 'public'
})

module.exports = withPWA({
    nextConfig,
    swSrc: 'service-worker.js',
    env: {
        TOKEN: 'e1b3c2502025cf5fd41260db920d5e05',
    },    
})
