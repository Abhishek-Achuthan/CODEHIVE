import type * as React from "react";

export interface RightColumnProps {
  children: React.ReactNode;
}

export default function RightColumn({ children }: RightColumnProps) {
  return <div className="grid gap-8 sticky top-4 h-fit">{children}</div>;
}
