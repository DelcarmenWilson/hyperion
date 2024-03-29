/**
 * An array of routes that are accesible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/new-verification",
  "/api/appointments/reminder",
  "/api/facebook",
  "/api/leads/details",
  "/api/organizations",
  "/api/quote",
  "/api/sms/in",
  "/api/sms/result",
  "/api/sms/out",
  "/api/test",
  "/api/token",
  "/api/voice",
  "/api/voice/action",
  "/api/voice/callback",
  "/api/voice/recording",
  "/api/voice/result",
  "/api/voice/transcribe",
  "/api/voice/voicemail",
];


/**
 * An array of routes that are used for authentications
 * These routes will redirect logged in users to /dashboard
 * @type {string[]}
 */

export const authRoutes = [
  "/login",
  "/register",
  "/error",
  "/reset",
  "/new-password",
];

/**
 * The prefix for api aithentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */

export const apiAuthPrefix = "/api/auth";

/**
 * The defsult redirect path after login in
 *
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
