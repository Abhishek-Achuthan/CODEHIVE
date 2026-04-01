import type { ReactNode } from "react";

import Header from "../shared/ui/Header";
import Footer from "../shared/ui/Footer";
import Sidebar from "../features/qna/components/SideBar";
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
    <div className="dark min-h-screen bg-background relative">
      <QnaBackgroundGlow />

      <Header />

      <div className="flex relative z-0">
        <Sidebar />

        <main className="flex-1">
          <div className="w-full max-w-7xl p-6">
            {(title || description) && (
              <div className="mb-8">
                {title && (
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="text-gray-400 text-base">
                    {description}
                  </p>
                )}
              </div>
            )}

            {children}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
