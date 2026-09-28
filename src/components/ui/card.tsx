import type { HTMLAttributes } from "react";

import { cn } from "../../utils/class-names";

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "section";
  padded?: boolean;
};

export default function Card({
  as: Tag = "section",
  padded = true,
  className,
  ...props
}: CardProps) {
  return (
    <Tag
      className={cn(
        "min-w-0 rounded-2xl border border-slate-200 bg-surface shadow-soft",
        padded && "p-6",
        className,
      )}
      {...props}
    />
  );
}
