import "server-only";
import { marked } from "marked";

/** Markdown dei contenuti editoriali (fonte fidata: il seed) → HTML. */
export function mdToHtml(md: string): string {
  return marked.parse(md, { async: false, gfm: true, breaks: false }) as string;
}
