import { type RouteConfig } from "@remix-run/route-config";
import { createRoutesFromFolders } from "@remix-run/v1-route-convention";
import { remixRoutesOptionAdapter } from "@remix-run/routes-option-adapter";

export default [
  ...(await remixRoutesOptionAdapter((defineRoutes) => {
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
  })),
] as RouteConfig;
