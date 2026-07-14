import type React from "react";
import { MdRemoveRedEye as MdEye, MdBookmark, MdEdit, MdDelete } from "react-icons/md";
import { QnaRichContent } from "./QnaRichContent";
import { parseDate, timeAgo } from "../../../shared/utils/dateUtils";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../shared/hooks/storeHooks";
import type { QuestionDetailsView } from "../../../shared/types/view/QuestionDetailsView";

interface QuestionHeaderSectionProps {
  data: QuestionDetailsView;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  votes?: number;
  userVote?: 1 | -1 | 0;
  onUpvote?: () => void;
  onDownvote?: () => void;
  onDeleteQuestion?: () => void;
}

export const QuestionHeaderSection: React.FC<QuestionHeaderSectionProps> = ({
  data,
  isBookmarked,
  onToggleBookmark,
  votes,
  userVote = 0,
  onUpvote,
  onDownvote,
  onDeleteQuestion,
}) => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const created = parseDate(data.createdAt);
  const updated = parseDate(data.lastEditedAt);
  const isAuthor = currentUser?.id === data.author.id;

  return (
    <div className="flex gap-6 mb-10 pb-8 border-b border-zinc-800/80">
      {/* Voting controls */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <button
          onClick={onUpvote}
          className={`flex items-center justify-center w-9 h-9 rounded-full border transition-all ${
            userVote === 1
              ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
              : "border-transparent text-zinc-500 hover:text-indigo-400 hover:bg-zinc-800"
          }`}
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M7 14l5-5 5 5z" />
          </svg>
        </button>

        <span className="text-xl font-semibold text-zinc-200">
          {votes ?? data.voteCount}
        </span>

        <button
          onClick={onDownvote}
          className={`flex items-center justify-center w-9 h-9 rounded-full border transition-all ${
            userVote === -1
              ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
              : "border-transparent text-zinc-500 hover:text-rose-400 hover:bg-zinc-800"
          }`}
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M17 10l-5 5-5-5z" />
          </svg>
        </button>

        <button
          onClick={onToggleBookmark}
          className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all mt-4 ${
            isBookmarked
              ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
              : "border-transparent text-zinc-500 hover:text-amber-400 hover:bg-zinc-800"
          }`}
        >
          <MdBookmark size={18} />
        </button>
      </div>

      {/* Main question content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-4 mb-4">
          <h1 className="text-2xl font-bold text-zinc-100 leading-tight">
            {data.title}
          </h1>
          
          {isAuthor && (
            <div className="flex gap-2 shrink-0">
              <Link
                to={`/qna/question/${data.id}/edit`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
              >
                <MdEdit size={14} />
                <span>Edit</span>
              </Link>
              <button
                onClick={onDeleteQuestion}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-md transition-colors"
              >
                <MdDelete size={14} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 mb-8 pb-6 border-b border-zinc-800/50">
          <span className="flex items-center gap-1.5">
            Asked <span className="text-zinc-300 font-medium">{timeAgo(created)}</span>
          </span>
          <span className="flex items-center gap-1.5">
            Modified <span className="text-zinc-300 font-medium">{timeAgo(updated)}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <MdEye size={16} />
            <span className="text-zinc-300 font-medium">{data.views}</span> views
          </span>
        </div>

        <div className="prose prose-invert max-w-none text-zinc-300 mb-8">
          <QnaRichContent
            html={data.contentHtml}
            className="qna-content qna-renderer leading-relaxed"
          />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {data.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-md bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Author */}
        <div className="flex justify-end">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#18181b] border border-zinc-800">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-semibold border border-indigo-500/20">
              {data.author.firstName?.charAt(0) || "U"}
            </div>
            <div>
              <div className="text-xs text-zinc-500 mb-0.5">asked {timeAgo(created)}</div>
              <p className="text-sm text-indigo-400 font-medium leading-tight">
                {data.author.firstName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};