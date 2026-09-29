import { Link } from "react-router-dom";

import Card from "../components/ui/card";
import { navItems } from "../constants/navigation";

export default function DashboardPage() {
  const toolCards = navItems.filter((item) => item.path !== "/");

  return (
    <div className="w-full space-y-8">
      <section>
        <h2 className="page-title">Marine Data Workspace</h2>

        <p className="page-description">
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

              <h3 className="section-title">{item.label}</h3>

              <p className="mt-2 leading-6 body-text">{item.description}</p>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
