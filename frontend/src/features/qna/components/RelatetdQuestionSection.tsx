import type React from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { RelatedQuestionView } from "../../../shared/types/view/RelatedQuestionView";

export interface RelatedQuestionsSectionProps {
  relatedQuestions: RelatedQuestionView[];
}

export const RelatedQuestionsSection: React.FC<RelatedQuestionsSectionProps> = ({
  relatedQuestions,
}) => {
  const navigate = useNavigate();

  const INITIAL_COUNT = 3;
  const STEP = 3;
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_COUNT);

  const total = Array.isArray(relatedQuestions) ? relatedQuestions.length : 0;

  const visibleQuestions = useMemo(() => {
    return (Array.isArray(relatedQuestions) ? relatedQuestions : []).slice(
      0,
      Math.min(visibleCount, total)
    );
  }, [relatedQuestions, total, visibleCount]);

  const canShowMore = visibleCount < total;
  const canToggle = total > INITIAL_COUNT;

  return (
    <aside className="w-full lg:w-80 shrink-0">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white mb-4">
          Related Questions
        </h2>
        <div className="space-y-3">
          {visibleQuestions.map((relQ) => (
            <div
              key={relQ.id}
              className="p-3 rounded-lg bg-zinc-900/30 border border-zinc-800/50 hover:border-zinc-700 transition-all cursor-pointer"
              onClick={() => navigate(`/qna/question/${relQ.id}`)}
            >
              <h3 className="text-base font-semibold text-blue-400 mb-2 line-clamp-2">
                {relQ.title}
              </h3>

              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">
                    {relQ.voteCount}
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

        {canToggle && (
          <button
            type="button"
            onClick={() =>
              setVisibleCount((prev) =>
                prev < total ? Math.min(total, prev + STEP) : INITIAL_COUNT
              )
            }
            className="mt-6 w-full py-2 rounded-lg border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white transition-all"
          >
            {canShowMore ? "Show more related questions" : "Show fewer related questions"}
          </button>
        )}
      </div>
    </aside>
  );
};
