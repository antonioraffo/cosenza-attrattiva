import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.BASE_URL ?? "https://cosenzaattrattiva.test:8443";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  // il dev server compila le pagine al primo accesso: pochi worker = test stabili
  workers: 2,
  expect: { timeout: 10_000 },
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL,
    locale: "it-IT",
    // Chromium nel container non ha la CA mkcert nel suo NSS: la validità del certificato
    // è verificata a parte da tests/e2e/tls.spec.ts con Node + NODE_EXTRA_CA_CERTS.
    ignoreHTTPSErrors: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "mobile", use: { ...devices["Pixel 7"], viewport: { width: 375, height: 812 } } },
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
  ],
});
