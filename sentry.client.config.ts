/**
 * Sentry Client-side Configuration
 * Captures errors in the browser
 */
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust sample rate in production
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  replaysSessionSampleRate: 0.05,
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: false,
    }),
  ],

  // Don't send errors in development
  enabled: process.env.NODE_ENV === "production",

  // Ignore common noisy errors
  ignoreErrors: [
    "ResizeObserver loop",
    "Non-Error promise rejection captured",
    "NetworkError",
    "Load failed",
    "Failed to fetch",
  ],
});
