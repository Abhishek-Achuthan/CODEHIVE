import { ArrowRight, Plus } from "lucide-react";
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
        "group relative inline-flex items-center justify-center bg-white font-semibold text-black rounded-xl overflow-hidden transition-all hover:scale-[1.02] active:scale-95",
        size === "compact"
          ? "w-[42px] h-[42px] sm:w-auto sm:h-auto px-0 sm:px-5 py-2.5 text-sm"
          : "px-8 py-4",
        className,
      )}
    >
      <Plus className={cn("h-5 w-5", size === "compact" ? "block sm:hidden" : "hidden")} />
      
      <span className={cn("items-center gap-2", size === "compact" ? "hidden sm:inline-flex" : "inline-flex")}>
        Create Room
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </button>
  );
};
