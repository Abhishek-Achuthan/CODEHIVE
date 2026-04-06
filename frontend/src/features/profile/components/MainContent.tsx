import type * as React from "react";

export interface MainContentProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

export default function MainContent({ left, right }: MainContentProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr] items-start">
      {left}
      {right}
    </div>
  );
}
