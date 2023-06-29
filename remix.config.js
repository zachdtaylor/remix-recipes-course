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
};
