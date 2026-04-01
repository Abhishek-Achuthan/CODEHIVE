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
      <div className="flex items-center gap-2">
        {selectedType === "list" ? (
          <button
            type="button"
            onClick={() => onRemoveFromList(q.id)}
            disabled={removingQuestionId === q.id}
            className="inline-flex items-center justify-center size-9 rounded-full border border-border/50 bg-background/60 hover:bg-background/80 transition disabled:opacity-60 disabled:cursor-not-allowed"
            aria-label="Remove from list"
            title="Remove from list"
          >
            <Trash2 className="size-4 text-foreground" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onUnsaveQuestion(q.id)}
            disabled={unsavingQuestionId === q.id}
            className="inline-flex items-center justify-center size-9 rounded-full border border-border/50 bg-background/60 hover:bg-red-500/10 hover:border-red-500/30 transition disabled:opacity-60 disabled:cursor-not-allowed"
            aria-label="Unsave question"
            title="Unsave question"
          >
            <Trash2 className="size-4 text-red-500" />
          </button>
        )}

        <button
          type="button"
          onClick={() => onOpenAddToList(q.id)}
          className="inline-flex items-center justify-center size-9 rounded-full border border-border/50 bg-background/60 hover:bg-background/80 transition"
          aria-label="Add to list"
          title="Add to list"
        >
          <Plus className="size-4 text-foreground" />
        </button>
      </div>
    ),
  }));

  return (
    <section className="flex-1 w-full flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/40 p-5 rounded-2xl border border-white/5 backdrop-blur-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-200">{headerTitle}</h2>
          <p className="text-sm text-gray-500 mt-1">
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
          <div className="flex flex-col items-center justify-center">
            <motion.div
               animate={{ y: [0, -10, 0] }}
               transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
               className="w-20 h-20 mb-6 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.1)]"
            >
               <BookmarkX className="w-10 h-10 text-indigo-400 opacity-80" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-200 mb-2">
               {searchTerm ? "No results found" : "No saved questions yet"}
            </h3>
            <p className="text-gray-500 max-w-sm">
               {searchTerm 
                 ? "Try adjusting your search terms." 
                 : "Browse the Q&A section and click the save icon to add questions to this list."}
            </p>
          </div>
        }
      />

      <div className="mt-8 h-10 flex items-center justify-center">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
    </section>
  );
}
