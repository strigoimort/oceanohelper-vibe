import { NavLink } from "react-router-dom";
import { navItems } from "../../constants/navigation";

export default function AppSidebar() {
  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Sidebar Header */}
      <div className="px-7 py-3">
        <p className="text-sm font-semibold text-slate-400">Getting Started</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-6">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                [
                  "group flex items-start gap-4 rounded-r-xl border-l-4 px-3 py-2.5 transition-all duration-200",

                  isActive
                    ? "border-sky-600 bg-sky-50 shadow-sm"
                    : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:translate-x-1",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  {/* Icon */}
                  <span
                    className={`mt-0.5 text-lg transition-colors ${
                      isActive
                        ? "text-sky-600"
                        : "text-slate-400 group-hover:text-slate-700"
                    }`}
                  >
                    {item.icon}
                  </span>

                  {/* Text */}
                  <div className="min-w-0">
                    <p
                      className={`truncate text-sm font-semibold ${
                        isActive ? "text-slate-900" : "text-slate-700"
                      }`}
                    >
                      {item.label}
                    </p>

                    <p
                      className={`mt-1 text-xs leading-5 ${
                        isActive ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
}
