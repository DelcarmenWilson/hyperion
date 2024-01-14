/**
 * An array of routes that are accesible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
// export const publicRoutes = ["/", "/auth/new-verification","/api/sms/in","/api/sms/out","/api/organizations"];
export const publicRoutes = ["/", "/new-verification","/api/:path*"];

/**
 * An array of routes that are used for authentications
 * These routes will redirect loginned users to /settings
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
 * The defsult redirect path after loginin
 *
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/";
