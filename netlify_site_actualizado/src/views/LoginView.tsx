import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSnapshot } from "@/context/SnapshotContext";
import { cn } from "@/lib/utils";

export function LoginView() {
  const { login, isAuthenticated } = useSnapshot();
  const navigate = useNavigate();
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  if (isAuthenticated) {
    navigate("/", { replace: true });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const ok = await login({ password_1: pw1, password_2: pw2 });
    setLoading(false);
    if (ok) {
      navigate("/", { replace: true });
    } else {
      setError("Contraseñas incorrectas. Verifica e intenta de nuevo.");
      setShake(true);
      setTimeout(() => setShake(false), 450);
    }
  }

  return (
    <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-2">
      {/* Brand panel */}
      <aside
        className="relative flex flex-col justify-between p-8 text-white lg:p-12"
        style={{
          background:
            "linear-gradient(135deg, #1E2A78, #3525CD 60%, #6470F0)",
        }}
      >
        <div className="flex size-12 items-center justify-center rounded-xl bg-white/15 text-h3 font-extrabold">
          DA
        </div>
        <div className="hidden max-w-md lg:block">
          <p className="text-micro uppercase tracking-[0.2em] text-white/70">
            Departamento de Anestesiología
          </p>
          <h1 className="mt-3 text-display font-bold leading-tight">
            Portal de consulta contable
          </h1>
          <p className="mt-4 text-body text-white/80">
            Consulta en tiempo real el estado de cuotas, ingresos, egresos y la
            actividad del departamento. Acceso exclusivo de lectura.
          </p>
        </div>
        <p className="hidden text-caption text-white/60 lg:block">
          Sistema de solo lectura · v2.0
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center bg-background p-6 sm:p-10">
        <form
          onSubmit={handleSubmit}
          className={cn("w-full max-w-sm space-y-5", shake && "animate-shake")}
        >
          <div className="space-y-1 lg:hidden">
            <p className="text-micro uppercase tracking-widest text-primary-500">
              Departamento de Anestesiología
            </p>
            <h1 className="text-h1 text-foreground">Portal contable</h1>
          </div>

          <div className="hidden lg:block">
            <h2 className="text-h1 text-foreground">Acceder</h2>
            <p className="mt-1 text-small text-muted-foreground">
              Ingresa las dos contraseñas de consulta.
            </p>
          </div>

          <PasswordField
            id="pw1"
            label="Contraseña 1"
            value={pw1}
            onChange={setPw1}
            show={show1}
            onToggle={() => setShow1((s) => !s)}
            autoFocus
          />
          <PasswordField
            id="pw2"
            label="Contraseña 2"
            value={pw2}
            onChange={setPw2}
            show={show2}
            onToggle={() => setShow2((s) => !s)}
          />

          {error && (
            <p
              role="alert"
              className="rounded-md bg-danger-50 px-3 py-2 text-small text-danger-700"
            >
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Verificando…
              </>
            ) : (
              "Acceder"
            )}
          </Button>

          <p className="text-center text-caption text-muted-foreground lg:hidden">
            Sistema de solo lectura · v2.0
          </p>
        </form>
      </main>
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  show,
  onToggle,
  autoFocus,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  autoFocus?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-caption font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus={autoFocus}
          autoComplete="off"
          className="px-9"
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </div>
  );
}
