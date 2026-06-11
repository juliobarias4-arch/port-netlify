# Portal contable — React + Vite + TypeScript

Migración del portal de consulta contable del Departamento de Anestesiología
de JavaScript vanilla a **React 18 + Vite + TypeScript + Tailwind CSS +
shadcn/ui**. Es un dashboard **de solo lectura** con modo claro y oscuro.

## Requisitos

- Node.js 18+ (probado con Node 24)
- npm 9+

## Cómo correr en desarrollo

```bash
npm install
npm run dev
```

Vite levanta el servidor en `http://localhost:5173` (o el siguiente puerto
libre). Abre esa URL en el navegador.

En desarrollo **no existen las Netlify Functions** (`/api/*`), así que la app
carga un **fixture embebido** con datos realistas (`src/lib/mockSnapshot.ts`):
14 residentes, 13 meses, ingresos/egresos, historial y 4 trimestres. En la
pantalla de login basta con escribir **cualquier par de contraseñas no vacías**
para entrar y ver el dashboard.

La detección dev/prod se hace con `import.meta.env.DEV` y un fallback por
hostname en `src/lib/api.ts`.

## Cómo construir para producción

```bash
npm run build
```

El comando ejecuta `tsc -b` (type-check estricto) y luego `vite build`.

### Dónde queda el output

El build se escribe en **`public/`** (configurado en `vite.config.ts` →
`build.outDir: "public"`). Eso coincide con `netlify.toml` →
`publish = "public"`, por lo que Netlify sirve directamente esa carpeta.

> `public/` se regenera en cada build y está en `.gitignore`.
> Los assets estáticos que deben sobrevivir al build (favicon) viven en
> `static/` (configurado como `publicDir` de Vite para no chocar con el
> `outDir`).

### Previsualizar el build localmente

```bash
npm run preview
```

## Cómo se conecta a las Netlify Functions

Las funciones serverless en `netlify/functions/` **no se modificaron**. La app
las consume vía los redirects de `netlify.toml`:

- `GET /api/status` → `status.mjs` — estado público del snapshot.
- `POST /api/data` con `{ password_1, password_2 }` → `data.mjs` — valida
  contraseñas y devuelve `{ ok, synced_at, source, data }`. Un 401 indica
  contraseñas incorrectas.

En producción:

1. El login envía las dos contraseñas a `POST /api/data`.
2. Si responde `ok`, el snapshot completo queda en memoria (Context +
   useReducer). **No se persiste** por seguridad — recargar la página vuelve al
   login.
3. El botón **refresh** del topbar vuelve a llamar `/api/data` con las
   credenciales en memoria.

El catch-all `/* → /index.html` del `netlify.toml` permite que React Router
maneje las rutas del lado del cliente.

## Estructura

```
src/
  components/
    ui/        # primitivas shadcn/ui (button, card, tabs, sheet, ...)
    layout/    # Sidebar, Topbar, BottomNav, AppLayout, ThemeToggle
    shared/    # KpiCard, DataCard, MoneyCell, PaymentBadge, RankChip, ...
    charts/    # MonthlyBarChart, IncomeDonut, AgingBars (Recharts)
  views/       # ResumenView, CuotasView, DeudasView, Ingresos/Egresos, ...
  context/     # SnapshotContext (estado global inmutable)
  hooks/       # useTheme, useChartColors, useReducedMotion
  lib/         # api, format (es-DO), rank, csv, utils, mockSnapshot
  types/       # snapshot.ts (contrato exacto del snapshot)
```

## Rutas

`/login`, `/` (Resumen), `/cuotas`, `/deudas`, `/ingresos`, `/egresos`,
`/historial`, `/record`. Todas excepto `/login` requieren autenticación.

## Tema claro / oscuro

- Estrategia `class` de Tailwind (`dark:` + `.dark` en `<html>`).
- Preferencia persistida en `localStorage` (`theme`).
- Default: sigue `prefers-color-scheme`. Un script inline en `index.html`
  aplica el tema antes del primer paint (evita parpadeo).
- Toggle sol/luna en el topbar.

## Notas de solo lectura

La interfaz no expone ninguna acción de edición. Las únicas acciones son:
refrescar, buscar, filtrar, ordenar, exportar CSV, cambiar tema, expandir el
sidebar y cerrar sesión.
