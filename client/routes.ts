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
  "/api/leads/export",
  "/api/organizations",
  "/api/test",
  "/api/token",
  "/api/quote",
  "/api/twilio/sms/in",
  "/api/twilio/sms/result",
  "/api/twilio/sms/out",
  "/api/twilio/voice",
  "/api/twilio/voice/action",
  "/api/twilio/voice/callback",
  "/api/twilio/voice/conference/recording",
  "/api/twilio/voice/recording",
  "/api/twilio/voice/result",
  "/api/twilio/voice/transcribe",
  "/api/twilio/voice/voicemail",
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
