import QnaLayout from "../../../layouts/QnaLayout";
import AskQuestionForm from "../components/AskQuestionForm";

export default function AskQuestionPage() {
  return (
    <QnaLayout 
    title="Ask a Question"
      description="Help the community by asking a clear, specific question. The more details you provide, the better answers you'll receive."
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2">
          <div className="p-8 rounded-2xl bg-black/40 border border-zinc-800/50 backdrop-blur-sm shadow-2xl shadow-purple-500/10">
            <AskQuestionForm />
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800/30">
            <h3 className="text-white font-semibold mb-2">✨ Be Specific</h3>
            <p className="text-gray-400 text-sm">
              Ask a focused question with all relevant details. Include error
              messages, code snippets, and what you've already tried.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800/30">
            <h3 className="text-white font-semibold mb-2">🏷️ Use Tags</h3>
            <p className="text-gray-400 text-sm">
              Add up to 5 relevant tags to help others find your question quickly
              and categorize it properly.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800/30">
            <h3 className="text-white font-semibold mb-2">💡 Format Well</h3>
            <p className="text-gray-400 text-sm">
              Use the description editor to format your question with code
              blocks, lists, and links for clarity.
            </p>
          </div>
        </div>
      </div>
    </QnaLayout>
  );
}
