/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@swisseph/node'],
  allowedDevOrigins: ['10.27.31.219'],

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
