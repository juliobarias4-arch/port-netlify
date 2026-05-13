import { jsonResponse, loadSnapshot, verifyPassword } from "./_shared.mjs";

export default async function handler(req) {
  if (req.method !== "POST") {
    return jsonResponse({ ok: false, error: "Método no permitido." }, 405);
  }

  const snapshot = await loadSnapshot();
  if (!snapshot) {
    return jsonResponse({ ok: false, error: "Todavía no hay datos sincronizados." }, 404);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ ok: false, error: "JSON inválido." }, 400);
  }

  const pw1 = String(body?.password_1 || "");
  const pw2 = String(body?.password_2 || "");
  const ok1 = verifyPassword(pw1, snapshot.auth?.password_1_hash || "");
  const ok2 = verifyPassword(pw2, snapshot.auth?.password_2_hash || "");

  if (!ok1 || !ok2) {
    return jsonResponse({ ok: false, error: "Contraseñas incorrectas." }, 401);
  }

  return jsonResponse({
    ok: true,
    synced_at: snapshot.synced_at,
    received_at: snapshot.received_at,
    source: snapshot.source,
    data: snapshot.data,
  });
}
