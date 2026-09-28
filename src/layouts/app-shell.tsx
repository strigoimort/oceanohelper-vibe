import { Outlet, useLocation } from "react-router-dom";
import AppFooter from "../components/layout/app-footer";
import AppHeader from "../components/layout/app-header";
import AppSidebar from "../components/layout/app-sidebar";

const FULL_BLEED_ROUTES = ["/geospatial-workspace", "/particle-tracer"];

export default function AppShell() {
  const location = useLocation();

  const isFullBleed = FULL_BLEED_ROUTES.includes(location.pathname);

  return (
    <div className="flex h-screen flex-col bg-canvas text-ink">
      <AppHeader />

      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />

        <main
          className={`flex-1 overflow-y-auto ${
            isFullBleed ? "bg-white" : "bg-canvas"
          }`}
        >
          <div className={isFullBleed ? "h-full" : "px-8 pt-8 pb-12"}>
            <Outlet />
          </div>
        </main>
      </div>

      <AppFooter />
    </div>
  );
}
