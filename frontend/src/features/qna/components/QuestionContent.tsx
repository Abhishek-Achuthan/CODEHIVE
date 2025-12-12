import { AnimatePresence, motion } from "framer-motion";
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
      <AnimatePresence mode="popLayout">
        {questions.map((q, idx) => (
          <motion.div
            key={q.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, delay: idx * 0.04 }}
          >
            <QuestionCard
              {...q}
              onclick={() => onSelect(q.id.toString())}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
