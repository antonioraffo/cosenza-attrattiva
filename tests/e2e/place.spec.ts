import { expect, passportOn, test } from "./fixtures";

test("scheda luogo: racconto, info, itinerari collegati", async ({ page }) => {
  await page.goto("/it/luoghi/duomo");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Il racconto" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Informazioni utili" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Negli itinerari" })).toBeVisible();
});

test("check-in fuori raggio non assegna il timbro", async ({ page, context }) => {
  test.skip(!passportOn, "passaporto disattivato");
  await context.grantPermissions(["geolocation"]);
  await context.setGeolocation({ latitude: 39.3, longitude: 16.25 });
  await page.goto("/it/luoghi/duomo");
  await page.getByRole("button", { name: "Fai check-in" }).click();
  await expect(page.getByText(/avvicinati entro/)).toBeVisible();
});
