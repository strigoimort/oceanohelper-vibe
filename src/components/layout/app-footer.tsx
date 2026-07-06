export default function AppFooter() {
  return (
    <footer className="mt-3 rounded-[24px] border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-500 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur sm:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span>Shell only • shared layout and placeholder routes</span>
        <span>Built for responsive navigation and future tool integration</span>
      </div>
    </footer>
  );
}
