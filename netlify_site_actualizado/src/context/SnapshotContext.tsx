import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { Credentials, Snapshot } from "@/types/snapshot";
import { AuthError, fetchSnapshot } from "@/lib/api";

type Status = "idle" | "loading" | "authenticated" | "error";

interface State {
  status: Status;
  snapshot: Snapshot | null;
  error: string | null;
  // credentials kept in-memory only (never persisted) so "refresh" can re-fetch.
  creds: Credentials | null;
}

type Action =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; snapshot: Snapshot; creds: Credentials }
  | { type: "LOGIN_ERROR"; error: string }
  | { type: "REFRESH_START" }
  | { type: "LOGOUT" };

const initialState: State = {
  status: "idle",
  snapshot: null,
  error: null,
  creds: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, status: "loading", error: null };
    case "REFRESH_START":
      return { ...state, status: "loading", error: null };
    case "LOGIN_SUCCESS":
      return {
        status: "authenticated",
        snapshot: action.snapshot,
        creds: action.creds,
        error: null,
      };
    case "LOGIN_ERROR":
      return { ...state, status: "error", error: action.error };
    case "LOGOUT":
      return { ...initialState };
    default:
      return state;
  }
}

interface SnapshotContextValue {
  status: Status;
  snapshot: Snapshot | null;
  error: string | null;
  isAuthenticated: boolean;
  login: (creds: Credentials) => Promise<boolean>;
  refresh: () => Promise<boolean>;
  logout: () => void;
}

const SnapshotContext = createContext<SnapshotContextValue | null>(null);

export function SnapshotProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = useCallback(async (creds: Credentials): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" });
    try {
      const snapshot = await fetchSnapshot(creds);
      dispatch({ type: "LOGIN_SUCCESS", snapshot, creds });
      return true;
    } catch (err) {
      const msg =
        err instanceof AuthError
          ? err.message
          : "No se pudo conectar con el servidor. Intenta de nuevo.";
      dispatch({ type: "LOGIN_ERROR", error: msg });
      return false;
    }
  }, []);

  const refresh = useCallback(async (): Promise<boolean> => {
    if (!state.creds) return false;
    dispatch({ type: "REFRESH_START" });
    try {
      const snapshot = await fetchSnapshot(state.creds);
      dispatch({ type: "LOGIN_SUCCESS", snapshot, creds: state.creds });
      return true;
    } catch (err) {
      const msg =
        err instanceof AuthError
          ? err.message
          : "No se pudo actualizar. Intenta de nuevo.";
      dispatch({ type: "LOGIN_ERROR", error: msg });
      return false;
    }
  }, [state.creds]);

  const logout = useCallback(() => dispatch({ type: "LOGOUT" }), []);

  const value = useMemo<SnapshotContextValue>(
    () => ({
      status: state.status,
      snapshot: state.snapshot,
      error: state.error,
      isAuthenticated: state.status === "authenticated" && !!state.snapshot,
      login,
      refresh,
      logout,
    }),
    [state, login, refresh, logout],
  );

  return (
    <SnapshotContext.Provider value={value}>
      {children}
    </SnapshotContext.Provider>
  );
}

export function useSnapshot(): SnapshotContextValue {
  const ctx = useContext(SnapshotContext);
  if (!ctx) throw new Error("useSnapshot must be used within SnapshotProvider");
  return ctx;
}

/** Convenience hook that returns the snapshot data or throws if not loaded. */
export function useSnapshotData() {
  const { snapshot } = useSnapshot();
  if (!snapshot) throw new Error("Snapshot not loaded");
  return snapshot.data;
}
