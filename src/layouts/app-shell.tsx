import { Outlet, useLocation } from "react-router-dom";

import AppFooter from "../components/layout/app-footer";
import AppHeader from "../components/layout/app-header";
import AppSidebar from "../components/layout/app-sidebar";
import { navItems } from "../constants/navigation";

type AppShellProps = {
  title?: string;
};

export default function AppShell({ title = "Workspace" }: AppShellProps) {
  const location = useLocation();
  const activeTitle =
    navItems.find((item) => item.path === location.pathname)?.label ?? title;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(226,232,240,0.7),transparent_30%),linear-gradient(135deg,#f8fafc_0%,#f1f5f9_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-3 py-3 sm:px-4 lg:px-6 lg:py-4">
        <AppHeader title={activeTitle} />

        <div className="flex flex-1 flex-col gap-3 lg:flex-row">
          <AppSidebar />

          <main className="flex-1 rounded-4xl border border-slate-200/80 bg-white/70 p-4 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>

        <AppFooter />
      </div>
    </div>
  );
}
