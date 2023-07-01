import { test, expect } from "@playwright/test";

test("redirects actor to login if they are not logged in", async ({ page }) => {
  await page.goto("/app/pantry");
  await expect(page.getByRole("button", { name: /log in/i })).toBeVisible();
});

test("lets a user do a typical flow", async ({ page }) => {
  await page.goto(
    "/__tests/login?email=test@example.com&firstName=Test&lastName=User"
  );
  await page.goto("/app/pantry");

  await page.getByRole("button", { name: /create shelf/i }).click();

  const shelfNameInput = page.getByRole("textbox", { name: /shelf name/i });
  await shelfNameInput.fill("Dairy");

  const newItemInput = page.getByPlaceholder(/new item/i);
  await newItemInput.type("Milk");
  await newItemInput.press("Enter");
  await newItemInput.type("Eggs");
  await newItemInput.press("Enter");
  await newItemInput.type("Yogurt");
  await newItemInput.press("Enter");

  await page.goto("/app/recipes");
  await page.goto("/app/pantry");

  expect(await shelfNameInput.inputValue()).toBe("Dairy");
  expect(page.getByText("Milk")).toBeVisible();
  expect(page.getByText("Eggs")).toBeVisible();
  expect(page.getByText("Yogurt")).toBeVisible();

  await page.getByRole("button", { name: /delete eggs/i }).click();
  expect(page.getByText("Eggs")).not.toBeVisible();

  page.on("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: /delete shelf/i }).click();
  expect(shelfNameInput).not.toBeVisible();
});
