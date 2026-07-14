import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import QuestionCard, { type QuestionCardProps } from "./QuestionCard";

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
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center border border-zinc-800 border-dashed bg-[#121214] rounded-2xl min-h-[300px]"
      >
        {typeof emptyMessage === 'string' || !emptyMessage ? (
          <p className="text-zinc-500 font-medium max-w-sm">
            {emptyMessage ?? "No questions found. Try adjusting your filters."}
          </p>
        ) : (
          emptyMessage
        )}
      </motion.div>
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
