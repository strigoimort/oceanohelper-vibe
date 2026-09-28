import { Link } from "react-router-dom";

import Card from "../components/ui/card";
import { navItems } from "../constants/navigation";

export default function DashboardPage() {
  const toolCards = navItems.filter((item) => item.path !== "/");

  return (
    <div className="w-full space-y-8">
      <section>
        <h2 className="text-4xl font-semibold tracking-tight text-ink">
          Marine Data Workspace
        </h2>

        <p className="mt-4 max-w-5xl text-lg leading-8 text-slate-600">
          Integrated tools for geospatial visualization, marine forecasting,
          wave analysis, climatology, and oceanographic data processing.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {toolCards.map((item) => (
          <Link key={item.path} to={item.path} className="block rounded-2xl">
            <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-float">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                {item.icon}
              </div>

              <h3 className="text-lg font-semibold text-ink">{item.label}</h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {item.description}
              </p>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
