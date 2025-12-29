import type * as React from "react";

export interface RightColumnProps {
  children: React.ReactNode;
}

export default function RightColumn({ children }: RightColumnProps) {
  return <div className="grid gap-4">{children}</div>;
}
