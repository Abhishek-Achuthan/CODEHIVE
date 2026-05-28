import { ArrowRight } from "lucide-react";
import { cn } from "../../../shared/utils/classNames";

interface CreateRoomButtonProps {
  onClick: () => void;
  className?: string;
  size?: "default" | "compact";
}

export const CreateRoomButton = ({
  onClick,
  className,
  size = "default",
}: CreateRoomButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 bg-white font-semibold text-black rounded-lg overflow-hidden transition-all hover:scale-[1.02] active:scale-95",
        size === "compact" ? "px-5 py-2.5 text-sm" : "px-8 py-4",
        className,
      )}
    >
      Create Room
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </button>
  );
};
