import Header from "../../../shared/ui/Header";
import Footer from "../../../shared/ui/Footer";
import Sidebar from "../components/SideBar";
import AskQuestionForm from "../components/AskQuestionForm";

export default function AskQuestionPage() {
  return (
    <div className="dark min-h-screen bg-background relative">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, oklch(0.35 0.15 280) 0%, oklch(0.15 0.08 275) 15%, oklch(0.08 0 0) 40%, oklch(0.08 0 0) 100%)",
          filter: "blur(120px)",
          opacity: 0.5,
          zIndex: -1,
        }}
      />

      <Header />

      <div className="flex relative z-0">
        <Sidebar />

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-white mb-2">
                Ask a Question
              </h1>
              <p className="text-gray-400 text-lg">
                Help the community by asking a clear, specific question. The
                more details you provide, the better answers you'll receive.
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
              <div className="xl:col-span-2">
                <div className="p-8 rounded-2xl bg-black/40 border border-zinc-800/50 backdrop-blur-sm shadow-2xl shadow-purple-500/10">
                  <AskQuestionForm />
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800/30">
                  <h3 className="text-white font-semibold mb-2">
                    ✨ Be Specific
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Ask a focused question with all relevant details. Include
                    error messages, code snippets, and what you've already
                    tried.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800/30">
                  <h3 className="text-white font-semibold mb-2">🏷️ Use Tags</h3>
                  <p className="text-gray-400 text-sm">
                    Add up to 5 relevant tags to help others find your question
                    quickly and categorize it properly.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800/30">
                  <h3 className="text-white font-semibold mb-2">
                    💡 Format Well
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Use the description editor to format your question with code
                    blocks, lists, and links for clarity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
