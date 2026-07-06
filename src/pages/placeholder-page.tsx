import { Link } from "react-router-dom";

type PlaceholderPageProps = {
  title: string;
  description: string;
  badge?: string;
};

export default function PlaceholderPage({
  title,
  description,
  badge = "Planned experience",
}: PlaceholderPageProps) {
  return (
    <section className="space-y-6 rounded-4xl border border-slate-200/80 bg-white/80 p-8 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700">
          {badge}
        </span>
        <span className="text-sm text-slate-500">
          Shell only • no tool logic yet
        </span>
      </div>

      <div className="max-w-2xl space-y-3">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
          {title}
        </h2>
        <p className="text-base leading-7 text-slate-600">{description}</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
        This route is configured as a placeholder so the application shell can
        be navigated before the individual analyses are implemented.
      </div>

      <Link
        to="/"
        className="inline-flex items-center rounded-full border border-slate-300 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
      >
        Back to dashboard
      </Link>
    </section>
  );
}
