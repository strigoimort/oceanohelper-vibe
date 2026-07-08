import { Settings2 } from "lucide-react";
import { useState } from "react";
import GlobalSearch from "../search/global-search";
import logo from "../../assets/oceanohelper-logo.png";

// type AppHeaderProps = {
//   title: string;
//   description?: string;
// };

// export default function AppHeader({ title, description }: AppHeaderProps) {
export default function AppHeader() {
  const [lastUpdate] = useState(new Date());

  const formattedTime = lastUpdate.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  });

  return (
    <header className="border-b border-slate-200 bg-white">
      {/* Top Header */}
      <div className="flex h-16 items-center justify-between px-6">
        {/* Brand */}
        <div className="flex items-center gap-4">
          <img
            src={logo}
            alt="OceanoHelper Logo"
            className="h-11 w-11 object-contain"
          />

          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              OceanoHelper
            </h2>

            <p className="text-xs tracking-wide text-slate-500">
              Oceanographic Analysis Toolkit
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="hidden w-full max-w-lg   px-8 lg:block">
          <div className="hidden w-full max-w-lg px-8 lg:block">
            <GlobalSearch />
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-5">
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 text-sm font-medium text-slate-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Ready
            </div>

            <p className="text-xs text-slate-500">
              Last Update {formattedTime}
            </p>
          </div>

          <button
            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            title="Settings"
          >
            <Settings2 size={18} />
          </button>
        </div>
      </div>

      {/* Page Header */}
      {/* <div className="flex items-center justify-between border-slate-100 border-t px-6 pt-1 pb-2 bg-slate-50">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            {title}
          </h1>

          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>
      </div> */}
    </header>
  );
}
