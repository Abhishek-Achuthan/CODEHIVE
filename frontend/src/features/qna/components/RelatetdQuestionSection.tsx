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
      <div className="sticky top-6">
        <h2 className="text-[13px] font-bold text-zinc-400 uppercase tracking-wider mb-4 px-1">
          Related Questions
        </h2>
        <div className="space-y-3">
          {visibleQuestions.map((relQ) => (
            <div
              key={relQ.id}
              className="p-4 rounded-xl bg-[#121214] border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer group"
              onClick={() => navigate(`/qna/question/${relQ.id}`)}
            >
              <h3 className="text-sm font-medium text-zinc-200 group-hover:text-indigo-400 transition-colors mb-3 line-clamp-2 leading-snug">
                {relQ.title}
              </h3>

              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-300 font-medium">
                    {relQ.voteCount}
                  </span>
                  <span>votes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-300 font-medium">
                    {relQ.views}
                  </span>
                  <span>views</span>
                </div>
              </div>

              {relQ.tags && relQ.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {relQ.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-zinc-800/50 text-zinc-400 text-[10px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                  {relQ.tags.length > 3 && (
                    <span className="px-2 py-0.5 rounded-md bg-zinc-800/30 text-zinc-500 text-[10px] font-medium">
                      +{relQ.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {total === 0 && (
          <div className="text-sm text-zinc-500 italic p-4 text-center border border-zinc-800 border-dashed rounded-xl">
            No related questions found.
          </div>
        )}

        {canToggle && (
          <button
            type="button"
            onClick={() =>
              setVisibleCount((prev) =>
                prev < total ? Math.min(total, prev + STEP) : INITIAL_COUNT
              )
            }
            className="mt-4 w-full py-2.5 rounded-lg border border-zinc-800 bg-[#121214] text-xs font-medium text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition-colors"
          >
            {canShowMore ? "Show more" : "Show less"}
          </button>
        )}
      </div>
    </aside>
  );
};
