import { getStore } from "@netlify/blobs";
import { createHash, pbkdf2Sync, timingSafeEqual } from "node:crypto";

export const STORE_NAME = "contabilidad";
export const SNAPSHOT_KEY = "latest-snapshot";

export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export function getSnapshotStore() {
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

export function expectedSyncToken() {
  return Netlify.env.get("ACCOUNTING_SYNC_TOKEN") || "";
}

export function safeEqualText(a, b) {
  const left = Buffer.from(String(a || ""));
  const right = Buffer.from(String(b || ""));
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function verifyPassword(plain, stored) {
  if (!plain || !stored) return false;

  if (stored.startsWith("pbkdf2:")) {
    const parts = stored.split(":");
    if (parts.length !== 3) return false;
    const salt = parts[1];
    const digest = parts[2];
    const computed = pbkdf2Sync(String(plain), salt, 260000, 32, "sha256").toString("hex");
    return safeEqualText(computed, digest);
  }

  if (stored.startsWith("sha256:")) {
    const parts = stored.split(":");
    if (parts.length !== 3) return false;
    const salt = parts[1];
    const digest = parts[2];
    const computed = createHash("sha256").update(salt + String(plain)).digest("hex");
    return safeEqualText(computed, digest);
  }

  return safeEqualText(String(plain), String(stored));
}

export async function loadSnapshot() {
  const store = getSnapshotStore();
  const raw = await store.get(SNAPSHOT_KEY, { type: "json", consistency: "strong" });
  return raw || null;
}
