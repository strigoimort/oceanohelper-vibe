import { useEffect, useState } from "react";
import {
  ChevronDown,
  Download,
  FileCode,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

import type { WindRoseExportFormat } from "../hooks/use-wind-rose-export";

const EXPORT_OPTIONS: {
  format: WindRoseExportFormat;
  label: string;
  description: string;
  icon: typeof Download;
}[] = [
  {
    format: "png",
    label: "PNG image",
    description: "For slides and reports",
    icon: ImageIcon,
  },
  {
    format: "pdf",
    label: "PDF document",
    description: "A4 landscape, ready to print",
    icon: FileText,
  },
  {
    format: "svg",
    label: "SVG vector",
    description: "Editable in Inkscape or Illustrator",
    icon: FileCode,
  },
  {
    format: "csv",
    label: "CSV statistics",
    description: "Summary values as a table",
    icon: FileSpreadsheet,
  },
];

type WindRoseExportMenuProps = {
  disabled?: boolean;
  onExport: (format: WindRoseExportFormat) => void;
};

export default function WindRoseExportMenu({
  disabled,
  onExport,
}: WindRoseExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((previous) => !previous)}
        className="inline-flex items-center gap-2 rounded-xl bg-accent px-3 py-2 text-sm font-medium text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Download size={16} />
        Export
        <ChevronDown
          size={14}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div
            role="menu"
            className="absolute right-0 top-full z-20 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-float"
          >
            {EXPORT_OPTIONS.map(
              ({ format, label, description, icon: Icon }) => (
                <button
                  key={format}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onExport(format);
                    setIsOpen(false);
                  }}
                  className="flex w-full items-start gap-3 px-3 py-2 text-left transition hover:bg-slate-50"
                >
                  <Icon size={16} className="mt-0.5 shrink-0 text-slate-400" />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-slate-900">
                      {label}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {description}
                    </span>
                  </span>
                </button>
              ),
            )}
          </div>
        </>
      )}
    </div>
  );
}
