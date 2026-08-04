import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import QuestionCard, { type QuestionCardProps } from "./QuestionCard";
import { EmptyState } from "../../../shared/ui/EmptyState";

type Question = QuestionCardProps & { id: string | number };

type Props = {
  loading: boolean;
  questions: Question[];
  onSelect: (id: string) => void;
  emptyMessage?: ReactNode;
};

export function QuestionContent({
  loading,
  questions,
  onSelect,
  emptyMessage,
}: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-zinc-500 font-medium">Loading questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="py-10">
        <EmptyState
          animationSrc="https://lottie.host/c878f65a-2ee7-401f-b813-9899fccd135a/7q1YxDrkmN.json"
          title="No questions found"
          description={typeof emptyMessage === 'string' && emptyMessage ? emptyMessage : "Try adjusting your filters or search terms to find what you're looking for."}
        />
      </div>
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
