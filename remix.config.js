/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  ignoredRouteFiles: [".*"],
  future: {
    v2_meta: true,
    v2_headers: true,
    v2_errorBoundary: true,
    v2_normalizeFormMethod: true,
    v2_dev: true,
  },
  serverModuleFormat: "cjs",
  // appDirectory: "app",
  // browserBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  // devServerPort: 8002
  routes: (defineRoutes) =>
    defineRoutes((route) => {
      if (process.env.INCLUDE_TEST_ROUTES) {
        if (process.env.NODE_ENV === "production") {
          console.warn(
            "WARNING: NODE_ENV is set to 'production', so we are going to skip creating test routes"
          );
          return;
        }
        route("__tests/login", "__test-routes__/login.tsx");
        route("__tests/delete-user", "__test-routes__/delete-user.tsx");
      }
    }),
};
