import type { ReactNode } from "react";
import { QnaBackgroundGlow } from "../shared/ui/QnaBackgroundGlow";

type QnaLayoutProps = {
  title?: string;
  description?: string;
  children: ReactNode;
};

export default function QnaLayout({
  title,
  description,
  children,
}: QnaLayoutProps) {
  return (
    <div className="dark h-full relative flex flex-col z-0">
      <QnaBackgroundGlow />

      <main className="flex-1 w-full max-w-7xl mx-auto pb-10 min-w-0">
        <div className="w-full p-6 lg:p-8">
          {(title || description) && (
            <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-4">
              <div>
                {title && (
                  <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="text-sm text-zinc-400">
                    {description}
                  </p>
                )}
              </div>
            </div>
          )}

          {children}
        </div>
      </main>
    </div>
  );
}
