import { jsonResponse, loadSnapshot } from "./_shared.mjs";

export default async function handler() {
  const snapshot = await loadSnapshot();
  return jsonResponse({
    ok: true,
    has_snapshot: Boolean(snapshot),
    synced_at: snapshot?.synced_at || null,
    received_at: snapshot?.received_at || null,
    source: snapshot?.source || null,
  });
}
