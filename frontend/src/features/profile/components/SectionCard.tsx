import type * as React from "react";

import { cn } from "../../../shared/utils/classNames";

export interface SectionCardProps {
  title?: string;
  rightAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  showHeader?: boolean;
}

export default function SectionCard({
  title,
  rightAction,
  children,
  className,
  contentClassName,
  showHeader = true,
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-zinc-800 bg-[#121214] text-zinc-200",
        className
      )}
    >
      {showHeader ? (
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-[#09090b]/50 rounded-t-xl">
          <h2 className="text-base font-semibold text-zinc-100 tracking-tight">{title}</h2>
          {rightAction ? <div>{rightAction}</div> : null}
        </div>
      ) : null}
      <div className={cn("px-6 py-5", contentClassName)}>{children}</div>
    </section>
  );
}
