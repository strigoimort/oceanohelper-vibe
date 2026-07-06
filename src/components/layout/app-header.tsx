type AppHeaderProps = {
  title: string;
};

export default function AppHeader({ title }: AppHeaderProps) {
  return (
    <header className="sticky top-3 z-20 mb-3 rounded-[24px] border border-slate-200/80 bg-white/80 px-4 py-3 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-lg font-semibold text-white">
            O
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              OceanoHelper
            </p>
            <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 sm:flex">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Interactive shell ready
        </div>
      </div>
    </header>
  );
}
