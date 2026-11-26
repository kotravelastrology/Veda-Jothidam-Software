/**
 * Runs once when a Next.js server starts (node_modules/next/dist/docs/01-app/02-guides/instrumentation.md). It starts the notification
 * clock (src/notify/schedulerHost.ts) in the Node.js server; the clock itself decides whether to run (production, or
 * KOTRAVEL_NOTIFY_SCHEDULER=on). The import sits inside the runtime test, as the guide shows, so the Edge build leaves it out (it
 * needs Node's crypto, https and sqlite).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startNotifyScheduler } = await import('./src/notify/schedulerHost');
    startNotifyScheduler();
  }
}
