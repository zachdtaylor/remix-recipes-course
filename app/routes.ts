import { index, route, type RouteConfig } from "@react-router/dev/routes";

const testRoutes = () => {
  if (process.env.INCLUDE_TEST_ROUTES) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "WARNING: NODE_ENV is set to 'production', so we are going to skip creating test routes"
      );
      return [];
    }
    return [
      route("__tests/login", "__test-routes__/login.tsx"),
      route("__tests/delete-user", "__test-routes__/delete-user.tsx"),
    ];
  }

  return [];
};

export default [
  index("routes/index.tsx"),
  route("app", "routes/app.tsx", [
    index("routes/app/index.tsx"),
    route("grocery-list", "routes/app/grocery-list.tsx"),
    route("pantry", "routes/app/pantry.tsx"),
    route("recipes", "routes/app/recipes.tsx", [
      route(":recipeId", "routes/app/recipes/$recipeId.tsx", [
        route(
          "update-meal-plan",
          "routes/app/recipes/$recipeId/update-meal-plan.tsx"
        ),
      ]),
    ]),
  ]),
  route("discover", "routes/discover.tsx"),
  route("discover/:recipeId", "routes/discover.$recipeId.tsx"),
  route("login", "routes/login.tsx"),
  route("logout", "routes/logout.tsx"),
  route("settings", "routes/settings.tsx", [
    index("routes/settings/index.tsx"),
    route("app", "routes/settings/app.tsx"),
  ]),
  route("theme.css", "routes/theme[.]css.tsx"),
  route("validate-magic-link", "routes/validate-magic-link.tsx"),

  ...testRoutes(),
] as RouteConfig;
