import type { JSX } from "react";
import { Plus } from "lucide-react";

type Props = {
  title: string;
  description?: string;
  total?: number;
  countLabel?: string;
  onAsk?: () => void;
  actionLabel?: string;
  filters?: JSX.Element;
  search?: JSX.Element;
};

export function QuestionHeader({
  title,
  description,
  total,
  countLabel = "questions",
  onAsk,
  actionLabel = "Ask question",
  filters,
  search,
}: Props) {
  return (
    <div className="mb-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100 flex items-center gap-3">
            {title}
            {total !== undefined && (
              <span className="text-sm font-medium px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {total.toLocaleString()} {countLabel}
              </span>
            )}
          </h1>
          {description && (
            <p className="text-sm text-zinc-400 mt-1.5">
              {description}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
          {search && <div className="w-full sm:w-64">{search}</div>}
          {onAsk && (
            <button
              onClick={onAsk}
              className="flex items-center gap-2 w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              {actionLabel}
            </button>
          )}
        </div>
      </div>

      {filters && (
        <div className="flex items-center border-b border-zinc-800 pb-4">
          {filters}
        </div>
      )}
    </div>
  );
}
