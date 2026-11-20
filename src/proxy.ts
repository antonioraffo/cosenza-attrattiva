import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Esclude API, asset statici, service worker e file con estensione
  matcher: ["/((?!api|_next|serwist|map|media|dev|pwa-icon|icon|apple-icon|manifest|.*\\..*).*)"],
};
