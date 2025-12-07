import type React from "react";
import Header from "../shared/ui/Header";
import Sidebar from "../features/qna/components/SideBar";
import Footer from "../shared/ui/Footer";

interface QnaLayoutProps {
  children: React.ReactNode;
}

const QnaLayout: React.FC<QnaLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 px-8 py-8 ml-6 max-w-7xl">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default QnaLayout;
