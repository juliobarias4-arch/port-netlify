import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider, useTheme } from "@/hooks/useTheme";
import { SnapshotProvider, useSnapshot } from "@/context/SnapshotContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoginView } from "@/views/LoginView";
import { ResumenView } from "@/views/ResumenView";
import { CuotasView } from "@/views/CuotasView";
import { DeudasView } from "@/views/DeudasView";
import { IngresosView } from "@/views/IngresosView";
import { EgresosView } from "@/views/EgresosView";
import { HistorialView } from "@/views/HistorialView";
import { RecordView } from "@/views/RecordView";

function ProtectedRoutes() {
  const { isAuthenticated } = useSnapshot();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <AppLayout />;
}

function ThemedToaster() {
  const { theme } = useTheme();
  return <Toaster theme={theme} position="bottom-right" richColors closeButton />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<ResumenView />} />
        <Route path="/cuotas" element={<CuotasView />} />
        <Route path="/deudas" element={<DeudasView />} />
        <Route path="/ingresos" element={<IngresosView />} />
        <Route path="/egresos" element={<EgresosView />} />
        <Route path="/historial" element={<HistorialView />} />
        <Route path="/record" element={<RecordView />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SnapshotProvider>
        <TooltipProvider delayDuration={200}>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
          <ThemedToaster />
        </TooltipProvider>
      </SnapshotProvider>
    </ThemeProvider>
  );
}
