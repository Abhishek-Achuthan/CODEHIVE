import { MdEdit, MdDelete } from "react-icons/md";
import { GiCheckMark } from "react-icons/gi";
import { QnaRichContent } from "./QnaRichContent";
import { useMemo, useState } from "react";
import ConfirmAcceptedAnswerModal from "./ConfirmAcceptedAnswerModal";

import { parseDate, timeAgo } from "../../../shared/utils/dateUtils";
import { Pagination } from "../../../shared/ui/Pagination";
import { SearchInput } from "./SearchInput";
import type { AnswerView } from "../../../shared/types/view/AnswerView";

type AnswerSort = "newest" | "oldest" | "votes";

type Props = {
  questionId?: string;
  acceptedAnswerId?: string | null;
  answers: AnswerView[];
  loading: boolean;
  totalAnswers: number;
  currentPage: number;
  totalPages: number;
  searchTerm: string;
  isSearching: boolean;
  sortBy: AnswerSort;
  currentUserId?: string;
  getVoteCount?: (answerId: string, fallback: number) => number;
  getUserVote?: (answerId: string) => 1 | -1 | 0;
  onUpvoteAnswer?: (answerId: string) => void;
  onDownvoteAnswer?: (answerId: string) => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: AnswerSort) => void;
  onPageChange: (page: number) => void;
  onAcceptAnswer?: (answerId: string) => Promise<boolean>;
  onRemoveAcceptedAnswer?: () => Promise<boolean>;
  onDeleteAnswer?: (answerId: string) => void;
  questionAskedBy?: string;
};

export function QuestionAnswersSection(props: Props) {
  const {
    questionId,
    acceptedAnswerId,
    answers,
    loading,
    totalAnswers,
    currentPage,
    totalPages,
    searchTerm,
    isSearching,
    sortBy,
    currentUserId, 
    getVoteCount,
    getUserVote,
    onUpvoteAnswer,
    onDownvoteAnswer,
    onSearchChange,
    onSortChange,
    onPageChange,
    onAcceptAnswer,
    onDeleteAnswer,
    onRemoveAcceptedAnswer,
    questionAskedBy,
  } = props;

  const isQuestionOwner = currentUserId && questionAskedBy && currentUserId === questionAskedBy;

  type PendingAction =
    | { type: 'accept'; answerId: string }
    | { type: 'switch'; answerId: string }
    | { type: 'remove'; answerId: string };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const modalCopy = useMemo(() => {
    if (!pending) return null;

    if (pending.type === 'remove') {
      return {
        title: 'Remove accepted answer',
        description: 'Remove the accepted answer for this question? You can accept another answer later.',
        confirmText: 'Remove',
      };
    }

    if (pending.type === 'switch') {
      return {
        title: 'Switch accepted answer',
        description: 'Mark this as the accepted answer instead? The previously accepted answer will be unaccepted.',
        confirmText: 'Switch',
      };
    }

    return {
      title: 'Accept answer',
      description: 'Are you satisfied with this answer? This will mark it as accepted.',
      confirmText: 'Accept',
    };
  }, [pending]);

  const onClickAccept = (answerId: string, isAccepted: boolean) => {
    if (!isQuestionOwner) return;
    if (!questionId) return;

    if (isAccepted || (acceptedAnswerId && acceptedAnswerId === answerId)) {
      setPending({ type: 'remove', answerId });
      setConfirmOpen(true);
      return;
    }

    if (acceptedAnswerId) {
      setPending({ type: 'switch', answerId });
      setConfirmOpen(true);
      return;
    }

    setPending({ type: 'accept', answerId });
    setConfirmOpen(true);
  };

  const onConfirm = async () => {
    if (!pending) return;
    setConfirmLoading(true);

    try {
      let ok: boolean | undefined;

      if (pending.type === 'remove') {
        ok = await onRemoveAcceptedAnswer?.();
      } else {
        ok = await onAcceptAnswer?.(pending.answerId);
      }

      if (ok === false) return;

      setConfirmOpen(false);
      setPending(null);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold">Answers ({totalAnswers})</h2>

        <div className="w-full md:w-auto">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as AnswerSort)}
            className="w-full md:w-auto px-3 py-2 rounded-lg bg-zinc-900/30 border border-zinc-800/50 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="votes">Most voted</option>
          </select>
        </div>
      </div>

      <SearchInput value={searchTerm} onChange={onSearchChange} />

      {modalCopy && (
        <ConfirmAcceptedAnswerModal
          open={confirmOpen}
          onOpenChange={(open) => {
            setConfirmOpen(open);
            if (!open) setPending(null);
          }}
          title={modalCopy.title}
          description={modalCopy.description}
          confirmText={modalCopy.confirmText}
          onConfirm={onConfirm}
          loading={confirmLoading}
        />
      )}

      {loading ? (
        <div className="p-4 rounded-lg bg-zinc-900/30 border border-zinc-800/50 text-center text-zinc-400">
          Loading answers...
        </div>
      ) : answers.length === 0 ? (
        <div className="p-4 rounded-lg bg-zinc-900/30 border border-zinc-800/50 text-center text-zinc-400">
          {isSearching ? "No matching answers found." : "No answers yet — be the first to help."}
        </div>
      ) : (
        <div className="space-y-6">
          {answers.map((a) => (
            <article
              key={a.id}
              className="p-4 rounded-lg bg-zinc-900/30 border border-zinc-800/50"
            >
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-2 py-1">
                  <button
                    onClick={() => onUpvoteAnswer?.(a.id)}
                    className={`flex items-center justify-center w-8 h-8 rounded-full border border-zinc-800 hover:border-purple-500/50 transition-all group ${getUserVote?.(a.id) === 1
                        ? "text-purple-400 border-purple-500/50"
                        : "text-zinc-400 hover:text-purple-400"
                      }`}
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M7 14l5-5 5 5z" />
                    </svg>
                  </button>

                  <span className="text-sm font-semibold text-white w-8 text-center">
                    {getVoteCount ? getVoteCount(a.id, a.voteCount) : a.voteCount}
                  </span>

                  <button
                    onClick={() => onDownvoteAnswer?.(a.id)}
                    className={`flex items-center justify-center w-8 h-8 rounded-full border border-zinc-800 hover:border-purple-500/50 transition-all group ${getUserVote?.(a.id) === -1
                        ? "text-purple-400 border-purple-500/50"
                        : "text-zinc-400 hover:text-purple-400"
                      }`}
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M17 10l-5 5-5-5z" />
                    </svg>
                  </button>

                  {(a.isAccepted || (currentUserId && currentUserId === questionAskedBy)) && (
                    <button
                      onClick={() => onClickAccept(a.id, a.isAccepted)}
                       className={`mt-2 flex items-center justify-center w-8 h-8 transition-all ${
                        a.isAccepted
                          ? "text-green-500"
                          : "text-zinc-600 hover:text-green-500 cursor-pointer"
                      } ${currentUserId !== questionAskedBy && !a.isAccepted ? "cursor-default opacity-50 hidden" : ""}`}
                      title={a.isAccepted ? "Accepted Answer" : "Accept this answer"}
                      disabled={currentUserId !== questionAskedBy && !a.isAccepted}
                    >
                      <GiCheckMark size={28} />
                    </button>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-medium">
                        {a.author.firstName?.[0] || "U"}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">
                          {a.author.firstName || "Anonymous"}
                        </div>
                        <div className="text-xs text-zinc-400">
                          {timeAgo(parseDate(a.createdAt))}
                        </div>
                      </div>
                    </div>

                    {a.author.id === currentUserId && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="text-blue-500 hover:text-blue-400 flex items-center text-sm"
                        >
                          <MdEdit className="mr-1" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteAnswer?.(a.id)}
                          className="text-red-500 hover:text-red-400 flex items-center text-sm"
                        >
                          <MdDelete className="mr-1" /> Delete
                        </button>
                      </div>
                    )}
                  </div>

                  <QnaRichContent
                    html={a.contentHtml}
                    className="qna-content qna-renderer text-zinc-200 text-base leading-relaxed"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="mt-8 h-10 flex items-center justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
