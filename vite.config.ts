import { vitePlugin as remix } from "@remix-run/dev";
import { createRoutesFromFolders } from "@remix-run/v1-route-convention";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/.*"],
      routes(defineRoutes) {
        return {
          ...createRoutesFromFolders(defineRoutes),
          ...defineRoutes((route) => {
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
      },
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        unstable_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
  server: {
    port: 3000,
  },
});
