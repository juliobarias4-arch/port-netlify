import { mkdir, copyFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = resolve(root, "public");

await mkdir(publicDir, { recursive: true });
await copyFile(resolve(root, "src", "index.html"), resolve(publicDir, "index.html"));
await copyFile(resolve(root, "src", "app.js"), resolve(publicDir, "app.js"));
await copyFile(resolve(root, "src", "styles.css"), resolve(publicDir, "styles.css"));

console.log("Netlify static files ready.");
