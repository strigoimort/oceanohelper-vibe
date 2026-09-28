import type { ReactNode } from "react";

type SectionTitleProps = {
  children: ReactNode;
  action?: ReactNode;
};

export default function SectionTitle({ children, action }: SectionTitleProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h2 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {children}
      </h2>
      {action}
    </div>
  );
}
