import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("discover", "routes/discover.tsx"),
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
  route("login", "routes/login.tsx"),
  route("logout", "routes/logout.tsx"),
  route("recipes/:recipeId/image", "routes/recipe-image.tsx"),
  route("settings", "routes/settings.tsx", [
    index("routes/settings/index.tsx"),
    route("app", "routes/settings/app.tsx"),
  ]),
  route("validate-magic-link", "routes/validate-magic-link.tsx"),
  route("my-resource", "routes/my-resource.tsx"),
] satisfies RouteConfig;
