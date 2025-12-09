import type { JSX } from "react";

type Props = {
  title: string;
  total: number;
  onAsk: () => void;
  filters: JSX.Element;
};

export function QuestionHeader({ title, total, onAsk, filters }: Props) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-foreground mb-4">
        {title}
      </h1>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-foreground/60">
          {total.toLocaleString()} questions
        </span>

        <div className="flex gap-2">
          {filters}
        </div>

        <button
          onClick={onAsk}
          className="ml-auto px-4 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg text-sm font-medium transition border border-white"
        >
          Ask question
        </button>
      </div>
    </div>
  );
}
