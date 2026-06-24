import type { Credentials, Snapshot, StatusResponse } from "@/types/snapshot";
import { mockSnapshot } from "./mockSnapshot";

/**
 * In `npm run dev` the Netlify Functions under /api/* do not exist, so we serve
 * the embedded fixture. In production (Netlify) we hit the real endpoints.
 * Detection: import.meta.env.DEV (Vite) OR a network failure fallback.
 */
const isDev = import.meta.env.DEV;

export class AuthError extends Error {}
export class NetworkError extends Error {}

function isLocalHost(): boolean {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1" || h.startsWith("192.168.");
}

export async function fetchStatus(): Promise<StatusResponse> {
  if (isDev) {
    return {
      ok: true,
      has_snapshot: true,
      synced_at: mockSnapshot.synced_at,
      source: mockSnapshot.source,
    };
  }
  try {
    const res = await fetch("/api/status", { headers: { Accept: "application/json" } });
    return (await res.json()) as StatusResponse;
  } catch {
    // Production endpoint unreachable — degrade to fixture status.
    return {
      ok: true,
      has_snapshot: true,
      synced_at: mockSnapshot.synced_at,
      source: mockSnapshot.source,
    };
  }
}

/**
 * Authenticate and load the snapshot. Returns the full Snapshot on success.
 * Throws AuthError on 401, NetworkError on unreachable endpoints in prod.
 */
export async function fetchSnapshot(creds: Credentials): Promise<Snapshot> {
  // DEV / localhost: accept any non-empty password and serve the fixture.
  if (isDev || isLocalHost()) {
    await delay(450); // simulate latency so skeletons are visible
    if (!creds.password.trim()) {
      throw new AuthError("Ingresa tu contraseña.");
    }
    return structuredClone(mockSnapshot);
  }

  let res: Response;
  try {
    res = await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(creds),
    });
  } catch {
    throw new NetworkError("No se pudo conectar con el servidor.");
  }

  if (res.status === 401) {
    const body = await safeJson(res);
    throw new AuthError(body?.error ?? "Contraseñas incorrectas.");
  }
  if (!res.ok) {
    const body = await safeJson(res);
    throw new NetworkError(body?.error ?? `Error ${res.status}.`);
  }

  const data = (await res.json()) as Snapshot;
  if (!data?.ok) {
    throw new AuthError((data as { error?: string })?.error ?? "Acceso denegado.");
  }
  return data;
}

async function safeJson(res: Response): Promise<{ error?: string } | null> {
  try {
    return (await res.json()) as { error?: string };
  } catch {
    return null;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
