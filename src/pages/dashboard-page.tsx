import { Link } from "react-router-dom";

import { navItems } from "../constants/navigation";

export default function DashboardPage() {
  const toolCards = navItems.filter((item) => item.path !== "/");

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-8 text-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.55)]">
        <div className="max-w-2xl space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-300">
            OceanoHelper dashboard
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            A focused workspace for marine data exploration.
          </h2>
          <p className="text-base leading-7 text-slate-300">
            The dashboard shell is now in place with shared navigation, a
            responsive application layout, and placeholder routes for each
            planned tool.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {toolCards.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="rounded-[24px] border border-slate-200/80 bg-white/80 p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-lg text-slate-700">
              {item.icon}
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              {item.label}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {item.description}
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
