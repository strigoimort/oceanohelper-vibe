// import { Outlet, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

import AppFooter from "../components/layout/app-footer";
import AppHeader from "../components/layout/app-header";
import AppSidebar from "../components/layout/app-sidebar";
// import { navItems } from "../constants/navigation";

// type AppShellProps = {
//   title?: string;
// };

// export default function AppShell({ title = "Workspace" }: AppShellProps) {
export default function AppShell() {
  // const location = useLocation();

  // const activeTitle =
  //   navItems.find((item) => item.path === location.pathname)?.label ?? title;

  return (
    <div className="flex h-screen flex-col bg-slate-100 text-slate-900">
      {/* Header */}
      {/* <AppHeader title={activeTitle} /> */}
      <AppHeader />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AppSidebar />

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-white p-8">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <AppFooter />
    </div>
  );
}
