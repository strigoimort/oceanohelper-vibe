import { NavLink } from "react-router-dom";

import { navItems } from "../../constants/navigation";

export default function AppSidebar() {
  return (
    <aside className="w-full rounded-[28px] border border-slate-200/80 bg-white/80 p-3 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:w-72 lg:shrink-0">
      <div className="mb-3 px-2 py-2">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
          Navigation
        </p>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              [
                "flex items-start gap-3 rounded-2xl px-3 py-3 text-sm transition-all duration-200",
                isActive
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/15"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              ].join(" ")
            }
          >
            <span className="mt-0.5 text-base">{item.icon}</span>
            <span className="min-w-0">
              <span className="block font-medium">{item.label}</span>
              <span className="mt-1 block text-xs leading-5 text-slate-400">
                {item.description}
              </span>
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
