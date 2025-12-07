import type React from "react";
import type { RelatedQuestionsSectionProps } from "../../../shared/types/qnaTypes";

export const RelatedQuestionsSection: React.FC<RelatedQuestionsSectionProps> = ({
  relatedQuestions,
}) => {
  return (
    <aside className="w-full lg:w-80 shrink-0">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white mb-4">
          Related Questions
        </h2>
        <div className="space-y-3">
          {relatedQuestions.map((relQ) => (
            <div
              key={relQ.id}
              className="p-3 rounded-lg bg-zinc-900/30 border border-zinc-800/50 hover:border-zinc-700 transition-all cursor-pointer"
            >
              <h3 className="text-base font-semibold text-blue-400 mb-2 line-clamp-2">
                {relQ.title}
              </h3>

              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">
                    {relQ.votes}
                  </span>
                  <span>votes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">
                    {relQ.views}
                  </span>
                  <span>views</span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {relQ.tags &&
                  relQ.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-md bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <button className="mt-6 w-full py-2 rounded-lg border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white transition-all">
          Load more related questions
        </button>
      </div>
    </aside>
  );
};
