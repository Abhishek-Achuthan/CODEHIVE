import type React from "react";
import { MdShare, MdRemoveRedEye as MdEye, MdBookmark } from "react-icons/md";
import { parseDate, timeAgo } from "../../../shared/utils/dateUtils";
import type { GetQuestionData } from "../../../shared/types/qnaTypes";

interface QuestionHeaderSectionProps {
  data: GetQuestionData;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const QuestionHeaderSection: React.FC<QuestionHeaderSectionProps> = ({
  data,
  isBookmarked,
  onToggleBookmark,
}) => {
  const created = parseDate(data.question.createdAt);
  const updated = parseDate(data.question.updatedAt);

  return (
    <div className="flex gap-6 mb-4">
      <div className="flex flex-col items-center gap-4 py-2">
        <button className="flex items-center justify-center w-8 h-8 rounded-full border border-zinc-800 hover:border-purple-500/50 text-zinc-400 hover:text-purple-400 transition-all group">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M7 14l5-5 5 5z" />
          </svg>
        </button>

        <span className="text-lg font-semibold text-white w-8 text-center">
          {data.question.votes}
        </span>

        <button className="flex items-center justify-center w-8 h-8 rounded-full border border-zinc-800 hover:border-purple-500/50 text-zinc-400 hover:text-purple-400 transition-all group">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M17 10l-5 5-5-5z" />
          </svg>
        </button>

        <button
          onClick={onToggleBookmark}
          className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all mt-2 ${
            isBookmarked
              ? "border-amber-500/50 bg-amber-500/10"
              : "border-zinc-800 hover:border-amber-500/50"
          }`}
        >
          <MdBookmark
            className={isBookmarked ? "text-amber-400" : "text-zinc-400"}
            size={18}
          />
        </button>

        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-zinc-800 hover:border-blue-500/50 text-zinc-400 hover:text-blue-400 transition-all">
          <MdShare size={18} />
        </button>
      </div>

      {/* Main question content */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-white mb-6 leading-tight">
          {data.question.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-zinc-400 mb-6 pb-6 border-b border-zinc-800/50">
          <span className="flex items-center gap-1">
            asked {timeAgo(created)}
          </span>
          <span>modified {timeAgo(updated)}</span>
          <span className="flex items-center gap-1">
            <MdEye size={16} />
            {data.question.views} views
          </span>
        </div>

        <div className="mb-6 p-4 rounded-lg bg-zinc-900/30 border border-zinc-800/50">
          <p className="text-zinc-200 whitespace-pre-wrap text-base leading-relaxed">
            {data.question.descriptionHtml}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {data.question.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-medium hover:bg-blue-500/20 transition-all cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Author */}
        <div className="flex justify-end mt-4">
          <div className="flex flex-col items-center text-right">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-2">
              <span className="text-white font-semibold text-sm">
                {data.author.firstName!.charAt(0)}
              </span>
            </div>

            <p className="text-sm text-white font-semibold leading-tight">
              {`${data.author.firstName} ${data.author.lastName}`}
            </p>

            <p className="text-xs text-zinc-400">
              {data.question.votes} reputation
            </p>

            <p className="text-xs text-zinc-400 mb-1">
              asked {timeAgo(created)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
