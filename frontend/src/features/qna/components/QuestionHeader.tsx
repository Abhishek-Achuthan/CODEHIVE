import type { JSX } from "react";

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
  countLabel = "questions available",
  onAsk,
  actionLabel = "Ask question",
  filters,
  search,
}: Props) {
  return (
    <div className="mb-8 space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex gap-4 sm:gap-6">
          <div className="w-1.5 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)] self-stretch" />
          <div className="shrink-0 flex flex-col justify-center">
            <h1 className="text-3xl font-bold italic text-white flex items-center">
              {title}
            </h1>
            {description && (
              <p className="text-base text-gray-400 mt-1">
                {description}
              </p>
            )}
            {total !== undefined && (
              <p className="text-sm font-medium text-gray-500 mt-1">
                {total.toLocaleString()} {countLabel}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
          {search && <div className="w-full sm:w-72">{search}</div>}
          {onAsk && (
            <button
              onClick={onAsk}
              className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] border border-indigo-500/50 hover:-translate-y-0.5"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>

      {filters && (
        <div className="flex justify-start w-full">
          {filters}
        </div>
      )}
    </div>
  );
}
