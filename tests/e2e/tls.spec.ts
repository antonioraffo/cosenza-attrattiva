import { request as httpsRequest } from "node:https";
import { expect, test } from "@playwright/test";

test("certificato TLS valido e firmato dalla CA locale", async ({ baseURL }) => {
  test.skip(test.info().project.name !== "desktop", "una sola volta");
  const status = await new Promise<number>((resolve, reject) => {
    // rejectUnauthorized di default: fallisce se la catena non è valida
    const req = httpsRequest(`${baseURL}/api/health`, (res) => resolve(res.statusCode ?? 0));
    req.on("error", reject);
    req.end();
  });
  expect(status).toBe(200);
});

test("HTTP reindirizza a HTTPS", async ({ request, baseURL }) => {
  test.skip(test.info().project.name !== "desktop", "una sola volta");
  const u = new URL(baseURL!);
  const httpPort = process.env.HTTP_PORT ?? (u.port === "8443" ? "8080" : "80");
  const res = await request.get(`http://${u.hostname}:${httpPort}/it`, { maxRedirects: 0 });
  expect(res.status()).toBe(308);
  expect(res.headers()["location"]).toMatch(/^https:\/\//);
});
