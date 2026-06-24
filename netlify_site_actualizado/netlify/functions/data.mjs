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

  // Acceso con UNA sola contraseña: basta que coincida con cualquiera de las
  // dos claves configuradas. Así dos personas distintas pueden entrar cada una
  // con su propia clave (separación de responsabilidades).
  const password = String(body?.password ?? body?.password_1 ?? "");
  const matches1 = verifyPassword(password, snapshot.auth?.password_1_hash || "");
  const matches2 = verifyPassword(password, snapshot.auth?.password_2_hash || "");

  if (!matches1 && !matches2) {
    return jsonResponse({ ok: false, error: "Contraseña incorrecta." }, 401);
  }

  return jsonResponse({
    ok: true,
    synced_at: snapshot.synced_at,
    received_at: snapshot.received_at,
    source: snapshot.source,
    data: snapshot.data,
  });
}
