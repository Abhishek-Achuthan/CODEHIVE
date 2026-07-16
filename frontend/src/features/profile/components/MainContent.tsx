import type * as React from "react";

export interface MainContentProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

export default function MainContent({ left, right }: MainContentProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[7fr_3fr] items-start">
      {left}
      {right}
    </div>
  );
}
