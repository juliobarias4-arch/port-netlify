import {
  SNAPSHOT_KEY,
  expectedSyncToken,
  getSnapshotStore,
  jsonResponse,
  safeEqualText,
} from "./_shared.mjs";

export default async function handler(req) {
  if (req.method !== "POST") {
    return jsonResponse({ ok: false, error: "Método no permitido." }, 405);
  }

  const expected = expectedSyncToken();
  const supplied = req.headers.get("x-sync-token") || "";
  if (!expected || !safeEqualText(supplied, expected)) {
    return jsonResponse({ ok: false, error: "No autorizado." }, 401);
  }

  let snapshot;
  try {
    snapshot = await req.json();
  } catch {
    return jsonResponse({ ok: false, error: "JSON inválido." }, 400);
  }

  if (!snapshot || typeof snapshot !== "object" || !snapshot.data || !snapshot.auth) {
    return jsonResponse({ ok: false, error: "Snapshot inválido." }, 400);
  }

  snapshot.synced_at = snapshot.synced_at || new Date().toISOString();
  snapshot.received_at = new Date().toISOString();

  const store = getSnapshotStore();
  await store.setJSON(SNAPSHOT_KEY, snapshot, {
    metadata: {
      synced_at: snapshot.synced_at,
      source: snapshot.source || "Programa principal",
    },
  });
  const saved = await store.get(SNAPSHOT_KEY, { type: "json", consistency: "strong" });

  return jsonResponse({
    ok: true,
    synced_at: snapshot.synced_at,
    received_at: snapshot.received_at,
    saved_synced_at: saved?.synced_at || null,
  });
}
