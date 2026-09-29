import { Link } from "react-router-dom";

import GeospatialWorkspacePage from "./geospatial-workspace-page";
import ParticleTracer from "./particle-tracer-page";

type PlaceholderPageProps = {
  title: string;
  description: string;
  badge?: string;
};

export default function PlaceholderPage({
  title,
  description,
  badge = "Coming Soon",
}: PlaceholderPageProps) {
  if (title === "Geospatial Workspace") {
    return <GeospatialWorkspacePage />;
  }
  if (title === "Particle Tracer") {
    return <ParticleTracer />;
  }

  return (
    <div className="space-y-8">
      <header className="border-b border-slate-200 pb-6">
        <div className="mb-3 flex items-center gap-3">
          <span className="border border-slate-300 px-2 py-1 text-xs uppercase tracking-wider text-slate-600">
            {badge}
          </span>

          <span className="secondary-text">Placeholder Page</span>
        </div>

        <h2 className="text-4xl font-semibold">{title}</h2>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          {description}
        </p>
      </header>

      <section className="border border-slate-200 bg-slate-50 p-6">
        This module is currently under development. The application routing,
        layout, and navigation have already been prepared.
      </section>

      <Link
        to="/"
        className="inline-flex border border-slate-900 px-5 py-2 text-sm font-medium transition hover:bg-slate-900 hover:text-white"
      >
        ← Dashboard
      </Link>
    </div>
  );
}
