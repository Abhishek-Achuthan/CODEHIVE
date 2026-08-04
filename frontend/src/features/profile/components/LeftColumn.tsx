import type * as React from "react";

export interface LeftColumnProps {
  children: React.ReactNode;
}

export default function LeftColumn({ children }: LeftColumnProps) {
  return <div className="grid gap-8">{children}</div>;
}
