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
        "rounded-xl border border-gray-700 bg-black text-white",
        className
      )}
    >
      {showHeader ? (
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <h2 className="text-sm font-semibold tracking-wide">{title}</h2>
          {rightAction ? <div>{rightAction}</div> : null}
        </div>
      ) : null}
      <div className={cn("px-4 py-3", contentClassName)}>{children}</div>
    </section>
  );
}
