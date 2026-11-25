import path from 'node:path';

const here = import.meta.dirname;

/**
 * In the browser build the calculation engines get the WebAssembly build of the same Swiss Ephemeris instead of the native addon, and
 * stand-ins for the Node modules they touch (src/offline/), so that a page can calculate on the device when the server cannot be
 * reached (src/offline/localEngine.ts). The server build is unchanged: @swisseph/node stays an external native package.
 * Both bundlers are configured: `next build` / `next dev` (Turbopack: all four stand-ins, for the browser only) and `--webpack` (the
 * ephemeris and `fs`; webpack's client build already brings Next's polyfills for `path` and `crypto`).
 */
const BROWSER_STAND_INS = {
  '@swisseph/node': './src/ephemeris/browserSwisseph.js',
  fs: './src/offline/browserFs.js',
  path: './src/offline/browserPath.js',
  crypto: './src/offline/browserCrypto.js',
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@swisseph/node'],
  // a phone on the same Wi-Fi opens the dev server by this computer's address, which changes with the network
  allowedDevOrigins: ['192.168.*.*', '10.*.*.*'],

  turbopack: {
    resolveAlias: Object.fromEntries(
      Object.entries(BROWSER_STAND_INS).flatMap(([name, file]) => {
        const entry = { browser: file };
        return name.startsWith('@') ? [[name, entry]] : [[name, entry], [`node:${name}`, entry]];
      }),
    ),
  },

  webpack(config, { isServer, webpack }) {
    if (!isServer) {
      // `node:fs` and the like: the same stand-ins as the bare names
      config.plugins.push(new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, '');
      }));
      config.resolve.alias = {
        ...config.resolve.alias,
        '@swisseph/node$': path.join(here, BROWSER_STAND_INS['@swisseph/node']),
      };
      // `path` and `crypto` keep Next's own browser polyfills (path-browserify, crypto-browserify: the same SHA-256); only `fs`,
      // which Next leaves empty, gets the stand-in
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: path.join(here, BROWSER_STAND_INS.fs),
      };
    }
    return config;
  },

  // Pages removed on 2026-10-31 (they showed sample numbers, not the chart's): an old link lands on the page that does the job now
  async redirects() {
    return [
      { source: '/professional-dashboard', destination: '/worksheet', permanent: false },
      { source: '/chart-display', destination: '/worksheet', permanent: false },
      { source: '/chart-view/:id', destination: '/worksheet', permanent: false },
      { source: '/create-chart', destination: '/worksheet?new=1', permanent: false },
      { source: '/dasha-display', destination: '/dasha-timeline', permanent: false },
      { source: '/house-strength', destination: '/report?section=bhavaBala', permanent: false },
      { source: '/planetary-strength', destination: '/interpreting-grahas', permanent: false },
      { source: '/launch-checklist', destination: '/', permanent: false },
    ];
  },
};

export default nextConfig;
