import QuestionCard, { type QuestionCardProps } from "./QuestionCard";

type Question = QuestionCardProps & { id: string | number };

type Props = {
  loading: boolean;
  questions: Question[];
  onSelect: (id: string) => void;
};

export function QuestionContent({
  loading,
  questions,
  onSelect,
}: Props) {
  if (loading) {
    return (
      <p className="text-foreground/60 text-center py-8">
        Loading questions...
      </p>
    );
  }

  if (questions.length === 0) {
    return (
      <p className="text-foreground/60 text-center py-8">
        No questions found. Try adjusting your filters.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <QuestionCard
          key={q.id}
          {...q}
          onclick={() => onSelect(q.id.toString())}
        />
      ))}
    </div>
  );
}
