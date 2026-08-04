import type * as React from "react";
import { Plus, Trash2, BookmarkX } from "lucide-react";
import { motion } from "framer-motion";

import { Pagination } from "../../../shared/ui/Pagination";
import { SearchInput } from "../components/SearchInput";
import { QuestionContent } from "../components/QuestionContent";

type Question = {
  id: string;
  title: string;
  contentHtml: string;
  tags: string[];
  voteCount: number;
  answerCount: number;
  views: number;
  actions?: React.ReactNode;
};

type Props = {
  headerTitle: string;
  totalQuestions: number;
  headerCountLabel: string;
  selectedType: "all" | "list";

  searchTerm: string;
  onChangeSearchTerm: (v: string) => void;

  loading: boolean;
  questions: Question[];
  onSelectQuestion: (id: string) => void;

  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;

  onRemoveFromList: (questionId: string) => void;
  removingQuestionId: string | null;

  onUnsaveQuestion: (questionId: string) => void;
  unsavingQuestionId: string | null;

  onOpenAddToList: (questionId: string) => void;
};

export default function SavedQuestionsMain({
  headerTitle,
  totalQuestions,
  headerCountLabel,
  selectedType,
  searchTerm,
  onChangeSearchTerm,
  loading,
  questions,
  onSelectQuestion,
  currentPage,
  totalPages,
  onPageChange,
  onRemoveFromList,
  removingQuestionId,
  onUnsaveQuestion,
  unsavingQuestionId,
  onOpenAddToList,
}: Props) {
  const questionsWithActions = questions.map((q) => ({
    ...q,
    actions: (
      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {selectedType === "list" ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFromList(q.id);
            }}
            disabled={removingQuestionId === q.id}
            className="inline-flex items-center justify-center size-8 rounded-md bg-[#121214] border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200 text-zinc-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Remove from list"
            title="Remove from list"
          >
            <Trash2 className="size-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onUnsaveQuestion(q.id);
            }}
            disabled={unsavingQuestionId === q.id}
            className="inline-flex items-center justify-center size-8 rounded-md bg-[#121214] border border-zinc-800 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 text-zinc-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Unsave question"
            title="Unsave question"
          >
            <Trash2 className="size-4" />
          </button>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenAddToList(q.id);
          }}
          className="inline-flex items-center justify-center size-8 rounded-md bg-[#121214] border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200 text-zinc-400 transition-colors"
          aria-label="Add to list"
          title="Add to list"
        >
          <Plus className="size-4" />
        </button>
      </div>
    ),
  }));

  return (
    <section className="flex-1 w-full flex flex-col gap-6 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100">{headerTitle}</h2>
          <p className="text-sm text-zinc-500 mt-1">
            {totalQuestions} {headerCountLabel}{totalQuestions === 1 ? "" : "s"}
          </p>
        </div>

        <div className="w-full sm:w-72">
          <SearchInput
            value={searchTerm}
            onChange={(v) => {
              onChangeSearchTerm(v);
              onPageChange(1);
            }}
            className="w-full mb-0"
          />
        </div>
      </div>

      <QuestionContent 
        loading={loading} 
        questions={questionsWithActions} 
        onSelect={onSelectQuestion}
        emptyMessage={
          <div className="flex flex-col items-center justify-center py-16">
            <motion.div
               animate={{ y: [0, -10, 0] }}
               transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
               className="w-16 h-16 mb-6 rounded-2xl bg-zinc-800/50 flex items-center justify-center border border-zinc-700/50"
            >
               <BookmarkX className="w-8 h-8 text-zinc-500" />
            </motion.div>
            <h3 className="text-lg font-semibold text-zinc-200 mb-2">
               {searchTerm ? "No results found" : "No saved questions yet"}
            </h3>
            <p className="text-sm text-zinc-500 max-w-sm text-center">
               {searchTerm 
                 ? "Try adjusting your search terms." 
                 : "Browse the Q&A section and click the save icon to add questions to this list."}
            </p>
          </div>
        }
      />

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </section>
  );
}
