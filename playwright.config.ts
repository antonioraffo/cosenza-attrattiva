import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.BASE_URL ?? "https://cosenzaattrattiva.test:8443";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  // il dev server compila le pagine al primo accesso: pochi worker = test stabili
  workers: process.env.E2E_PROD ? 1 : 2,
  expect: { timeout: 10_000 },
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL,
    locale: "it-IT",
    // Nessuna eccezione TLS: il container e2e registra la CA mkcert nell'NSS di Chromium
    // (docker/e2e), quindi il browser verifica il certificato come su un dispositivo reale.
    ignoreHTTPSErrors: false,
    // WebGL2 software (SwiftShader) per MapLibre e Cesium nel Chromium headless
    launchOptions: { args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    // densità 1x: il WebGL software (SwiftShader) a 2,6x satura il thread principale
    { name: "mobile", use: { ...devices["Pixel 7"], viewport: { width: 375, height: 812 }, deviceScaleFactor: 1 } },
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
  ],
});
