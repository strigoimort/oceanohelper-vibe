import { NavLink } from "react-router-dom";
import { navItems } from "../../constants/navigation";

export default function AppSidebar() {
  return (
    <aside className="w-80 shrink-0 border-r border-slate-200 bg-white">
      <div className="px-6 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Navigation
        </p>
      </div>

      <nav className="space-y-1 px-3 pb-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              [
                "flex items-start gap-3 border-l-4 px-4 py-3 transition-colors duration-150",

                isActive
                  ? "border-sky-600 bg-slate-100 text-slate-900"
                  : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              ].join(" ")
            }
          >
            <span className="mt-0.5 text-base">{item.icon}</span>

            <span>
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
