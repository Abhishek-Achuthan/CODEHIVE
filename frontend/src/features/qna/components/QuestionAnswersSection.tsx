import { MdEdit, MdDelete } from "react-icons/md";
import { GiCheckMark } from "react-icons/gi";
import { QnaRichContent } from "./QnaRichContent";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmAcceptedAnswerModal from "./ConfirmAcceptedAnswerModal";
import ConfirmModal from "./ConfirmModal";
import { CommentSection } from "./CommentSection";

import { parseDate, timeAgo } from "../../../shared/utils/dateUtils";
import { SearchInput } from "./SearchInput";
import type { AnswerView } from "../../../shared/types/view/AnswerView";

type AnswerSort = "newest" | "oldest" | "votes";

type Props = {
  questionId?: string;
  acceptedAnswerId?: string | null;
  answers: AnswerView[];
  loading: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
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
    hasMore,
    onLoadMore,
    totalAnswers,
    currentPage,
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
    onAcceptAnswer,
    onDeleteAnswer,
    onRemoveAcceptedAnswer,
    questionAskedBy,
  } = props;

  const navigate = useNavigate();
  const observerTarget = useRef<HTMLDivElement>(null);
  const isQuestionOwner = currentUserId && questionAskedBy && currentUserId === questionAskedBy;

  type PendingAction =
    | { type: 'accept'; answerId: string }
    | { type: 'switch'; answerId: string }
    | { type: 'remove'; answerId: string };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [deletingAnswerId, setDeletingAnswerId] = useState<string | null>(null);

  const [expandedAnswerIds, setExpandedAnswerIds] = useState<Set<string>>(new Set());

  // Infinite Scroll Trigger
  useEffect(() => {
    if (!hasMore || loading || !onLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [hasMore, loading, onLoadMore]);

  // Prioritize accepted answer to top
  const sortedAnswers = useMemo(() => {
    if (!answers) return [];
    return [...answers].sort((a, b) => {
      const aAccepted = a.isAccepted || (acceptedAnswerId && a.id === acceptedAnswerId);
      const bAccepted = b.isAccepted || (acceptedAnswerId && b.id === acceptedAnswerId);
      if (aAccepted && !bAccepted) return -1;
      if (!aAccepted && bAccepted) return 1;
      return 0;
    });
  }, [answers, acceptedAnswerId]);

  const toggleExpand = (id: string) => {
    setExpandedAnswerIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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

  const getPlainText = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html || "";
    return (tmp.textContent || tmp.innerText || "").trim();
  };

  return (
    <div className="mt-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-zinc-100">{totalAnswers} Answers</h2>

        <div className="w-full md:w-auto">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as AnswerSort)}
            className="w-full md:w-auto px-4 py-2 rounded-lg bg-[#121214] border border-zinc-800 text-sm text-zinc-300 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="votes">Highest Score</option>
          </select>
        </div>
      </div>

      <div className="mb-8">
        <SearchInput value={searchTerm} onChange={onSearchChange} placeholder="Filter answers..." />
      </div>

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

      <ConfirmModal
        open={Boolean(deletingAnswerId)}
        onOpenChange={(open) => {
          if (!open) setDeletingAnswerId(null);
        }}
        title="Delete Answer"
        description="Are you sure you want to delete this answer? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        onConfirm={async () => {
          if (deletingAnswerId) {
            await onDeleteAnswer?.(deletingAnswerId);
            setDeletingAnswerId(null);
          }
        }}
      />

      {loading && currentPage === 1 ? (
        <div className="py-12 rounded-xl border border-zinc-800 border-dashed text-center text-zinc-500">
          Loading answers...
        </div>
      ) : sortedAnswers.length === 0 ? (
        <div className="py-12 rounded-xl border border-zinc-800 border-dashed text-center text-zinc-500">
          {isSearching ? "No matching answers found." : "No answers yet. Be the first to help!"}
        </div>
      ) : (
        <div className="space-y-8">
          {sortedAnswers.map((a) => {
            const isAccepted = a.isAccepted || (acceptedAnswerId && acceptedAnswerId === a.id);
            const isExpanded = expandedAnswerIds.has(a.id);
            const textContent = getPlainText(a.contentHtml);
            const isLong = textContent.length > 280 || (a.contentHtml.match(/<p>|<br|<li/g) || []).length >= 5;
            const isEdited = (a.version && a.version > 1) || Boolean(a.updatedAt && a.updatedAt !== a.createdAt);

            return (
              <article
                key={a.id}
                className={`p-6 rounded-xl border transition-all ${
                  isAccepted
                    ? "bg-emerald-500/5 border-emerald-500/40 ring-1 ring-emerald-500/20 shadow-lg shadow-emerald-950/20"
                    : "bg-[#121214] border-zinc-800"
                }`}
              >
                <div className="flex gap-6">
                  {/* Voting and Accept controls */}
                  <div className="flex flex-col items-center gap-3 pt-1 shrink-0">
                    <button
                      onClick={() => onUpvoteAnswer?.(a.id)}
                      className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all ${
                        getUserVote?.(a.id) === 1
                          ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                          : "border-transparent text-zinc-500 hover:text-indigo-400 hover:bg-zinc-800"
                      }`}
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M7 14l5-5 5 5z" />
                      </svg>
                    </button>

                    <span className="text-lg font-semibold text-zinc-200">
                      {getVoteCount ? getVoteCount(a.id, a.voteCount) : a.voteCount}
                    </span>

                    <button
                      onClick={() => onDownvoteAnswer?.(a.id)}
                      className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all ${
                        getUserVote?.(a.id) === -1
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                          : "border-transparent text-zinc-500 hover:text-rose-400 hover:bg-zinc-800"
                      }`}
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M17 10l-5 5-5-5z" />
                      </svg>
                    </button>

                    {(isAccepted || (currentUserId && currentUserId === questionAskedBy)) && (
                      <button
                        onClick={() => onClickAccept(a.id, Boolean(isAccepted))}
                        className={`mt-3 flex items-center justify-center w-9 h-9 rounded-full border transition-all ${
                          isAccepted
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "border-transparent text-zinc-600 hover:text-emerald-400 hover:bg-zinc-800"
                        } ${currentUserId !== questionAskedBy && !isAccepted ? "opacity-0 pointer-events-none" : ""}`}
                        title={isAccepted ? "Accepted Answer" : "Mark as accepted answer"}
                        disabled={currentUserId !== questionAskedBy && !isAccepted}
                      >
                        <GiCheckMark size={20} />
                      </button>
                    )}
                  </div>

                  {/* Answer content */}
                  <div className="flex-1 min-w-0">
                    {isAccepted && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                        <GiCheckMark size={13} /> Accepted Answer
                      </div>
                    )}

                    <div className="mb-6">
                      <div className={`prose prose-invert max-w-none text-zinc-300 ${!isExpanded && isLong ? "line-clamp-5 overflow-hidden" : ""}`}>
                        <QnaRichContent
                          html={a.contentHtml}
                          className="qna-content qna-renderer leading-relaxed"
                        />
                      </div>
                      {isLong && (
                        <button
                          type="button"
                          onClick={() => toggleExpand(a.id)}
                          className="mt-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          {isExpanded ? "Show less" : "Read more..."}
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-zinc-800/80">
                      {a.author.id === currentUserId ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/qna/answers/${a.id}/edit`)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 rounded-md transition-colors"
                          >
                            <MdEdit size={14} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingAnswerId(a.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
                          >
                            <MdDelete size={14} /> Delete
                          </button>
                        </div>
                      ) : (
                        <div /> 
                      )}

                      <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 px-3 py-2 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-medium text-sm border border-indigo-500/20">
                          {a.author.firstName?.[0] || "U"}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-indigo-400 leading-none mb-1">
                            {a.author.firstName || "Anonymous"}
                          </div>
                          <div className="text-xs text-zinc-500">
                            answered {timeAgo(parseDate(a.createdAt))}
                            {isEdited && (
                              <span className="text-[11px] text-zinc-500 italic ml-1.5">(edited)</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <CommentSection answerId={a.id} currentUserId={currentUserId} />
                  </div>
                </div>
              </article>
            );
          })}

          {/* Infinite scroll sentinel & loader */}
          <div ref={observerTarget} className="py-4 text-center">
            {loading && currentPage > 1 && (
              <div className="text-sm text-zinc-500 animate-pulse">
                Loading more answers...
              </div>
            )}
            {!hasMore && sortedAnswers.length > 0 && (
              <div className="text-xs text-zinc-600 pt-2">
                All {totalAnswers} answers loaded
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
