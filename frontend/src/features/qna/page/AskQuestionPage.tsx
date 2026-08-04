import QnaLayout from "../../../layouts/QnaLayout";
import AskQuestionForm from "../components/AskQuestionForm";

export default function AskQuestionPage() {
  return (
    <QnaLayout 
      title="Ask a Question"
      description="Help the community by asking a clear, specific question. The more details you provide, the better answers you'll receive."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 sm:p-8 rounded-xl bg-[#121214] border border-zinc-800/80 shadow-sm">
            <AskQuestionForm />
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
            <h3 className="text-indigo-400 font-semibold mb-1.5 flex items-center gap-2 text-sm">
              ✨ Be Specific
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Ask a focused question with all relevant details. Include error
              messages, code snippets, and what you've already tried.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#121214] border border-zinc-800/80">
            <h3 className="text-zinc-200 font-semibold mb-1.5 flex items-center gap-2 text-sm">
              🏷️ Use Tags
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Add up to 5 relevant tags to help others find your question quickly
              and categorize it properly.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#121214] border border-zinc-800/80">
            <h3 className="text-zinc-200 font-semibold mb-1.5 flex items-center gap-2 text-sm">
              💡 Format Well
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Use the description editor to format your question with code
              blocks, lists, and links for clarity.
            </p>
          </div>
        </div>
      </div>
    </QnaLayout>
  );
}
