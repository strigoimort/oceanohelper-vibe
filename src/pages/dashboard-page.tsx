import { Link } from "react-router-dom";
import { navItems } from "../constants/navigation";

export default function DashboardPage() {
  const toolCards = navItems.filter((item) => item.path !== "/");

  return (
    <div className="space-y-8">
      <section className="border-b border-slate-200 pb-8">
        {/* <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
          OceanoHelper
        </p> */}

        <h2 className="text-4xl font-semibold tracking-tight text-slate-900">
          Marine Data Workspace
        </h2>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Integrated tools for geospatial visualization, marine forecasting,
          wave analysis, climatology, and oceanographic data processing.
        </p>
      </section>

      <section className="grid gap-px border border-slate-200 bg-slate-200 md:grid-cols-2 xl:grid-cols-3">
        {toolCards.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="bg-white p-6 transition-colors hover:bg-slate-50"
          >
            <div className="mb-4 text-2xl">{item.icon}</div>

            <h3 className="text-lg font-semibold">{item.label}</h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {item.description}
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
