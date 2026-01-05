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
  

  console.log('data from question details',data)

  return (
    <div className="flex gap-6 mb-4">
      {/* Voting controls */}
      <div className="flex flex-col items-center gap-4 py-2">
        <button
          onClick={onUpvote}
          className={`flex items-center justify-center w-8 h-8 rounded-full border border-zinc-800 hover:border-purple-500/50 transition-all group ${
            userVote === 1
              ? "text-purple-400 border-purple-500/50"
              : "text-zinc-400 hover:text-purple-400"
          }`}
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M7 14l5-5 5 5z" />
          </svg>
        </button>

        <span className="text-lg font-semibold text-white w-8 text-center">
          {votes ?? data.voteCount}
        </span>

        <button
          onClick={onDownvote}
          className={`flex items-center justify-center w-8 h-8 rounded-full border border-zinc-800 hover:border-purple-500/50 transition-all group ${
            userVote === -1
              ? "text-purple-400 border-purple-500/50"
              : "text-zinc-400 hover:text-purple-400"
          }`}
        >
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

        {/* <button className="w-8 h-8 flex items-center justify-center rounded-full border border-zinc-800 hover:border-blue-500/50 text-zinc-400 hover:text-blue-400 transition-all">
          <MdShare size={18} />
        </button> */}
      </div>

      {/* Main question content */}
      <div className="flex-1">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-white leading-tight">
            {data.title}
          </h1>
          
          {isAuthor && (
            <div className="flex gap-2">
              <Link
                to={`/qna/question/${data.id}/edit`}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <MdEdit size={16} className="shrink-0" />
                <span>Edit</span>
              </Link>
              <button
                onClick={onDeleteQuestion}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <MdDelete size={16} className="shrink-0" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-zinc-400 mb-6 pb-6 border-b border-zinc-800/50">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/50 text-zinc-300">
            <span className="text-purple-400">Asked:</span> {timeAgo(created)}
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/50 text-zinc-300">
            <span className="text-blue-400">Modified:</span> {timeAgo(updated)}
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/50 text-zinc-300">
            <MdEye size={16} className="text-blue-400" />
            <span>{data.views} views</span>
          </span>
        </div>

        <div className="mb-6 p-4 rounded-lg bg-zinc-900/30 border border-zinc-800/50">
          <QnaRichContent
            html={data.contentHtml}
            className="qna-content qna-renderer text-zinc-200 text-base leading-relaxed"
          />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {data.tags?.map((tag) => (
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
                {data.author.firstName?.charAt(0) || "U"}
              </span>
            </div>

            <p className="text-sm text-white font-semibold leading-tight">
              {data.author.firstName}
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