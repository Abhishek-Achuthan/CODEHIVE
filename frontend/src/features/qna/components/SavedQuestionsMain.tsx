import type * as React from "react";

import { Plus, Trash2 } from "lucide-react";

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

  onCreateList: () => void;

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
  onCreateList,
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
    <section className="flex-1">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-foreground">{headerTitle}</h1>
        <button
          type="button"
          onClick={onCreateList}
          className="text-sm text-foreground/70 hover:text-foreground transition"
        >
          Create new list
        </button>
      </div>

      <div className="text-sm text-foreground/60 mb-6">
        {totalQuestions} {headerCountLabel}
        {totalQuestions === 1 ? "" : "s"}
      </div>

      <SearchInput
        value={searchTerm}
        onChange={(v) => {
          onChangeSearchTerm(v);
          onPageChange(1);
        }}
      />

      <QuestionContent loading={loading} questions={questionsWithActions} onSelect={onSelectQuestion} />

      <div className="mt-8 h-10 flex items-center justify-center">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
    </section>
  );
}
