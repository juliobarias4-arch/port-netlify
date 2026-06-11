import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { BottomNav } from "./BottomNav";
import { NAV_ITEMS } from "./navItems";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useSnapshot } from "@/context/SnapshotContext";

function useViewMeta() {
  const { pathname } = useLocation();
  const match =
    NAV_ITEMS.find((i) =>
      i.to === "/" ? pathname === "/" : pathname.startsWith(i.to),
    ) ?? NAV_ITEMS[0];
  return { title: match.label, subtitle: match.subtitle };
}

export function AppLayout() {
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { snapshot, refresh, logout } = useSnapshot();
  const navigate = useNavigate();
  const meta = useViewMeta();

  async function handleRefresh() {
    setRefreshing(true);
    const ok = await refresh();
    setRefreshing(false);
    toast[ok ? "success" : "error"](
      ok ? "Datos actualizados" : "No se pudo actualizar",
    );
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden shrink-0 md:block">
        <Sidebar
          expanded={expanded}
          onToggleExpand={() => setExpanded((e) => !e)}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile drawer sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-60 max-w-[80vw] p-0">
          <Sidebar
            expanded
            onToggleExpand={() => {}}
            onLogout={handleLogout}
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          title={meta.title}
          subtitle={meta.subtitle}
          syncedAt={snapshot?.synced_at ?? null}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onLogout={handleLogout}
          onOpenMobileNav={() => setMobileOpen(true)}
        />

        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className="mx-auto max-w-[1440px] px-5 py-6 md:px-10 md:py-8">
            <Outlet />
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
