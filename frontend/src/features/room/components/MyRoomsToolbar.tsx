import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../../shared/utils/classNames";
import { CreateRoomButton } from "./CreateRoomButton";
import {
  MyRoomsVisibilityTabs,
  type MyRoomsVisibilityFilter,
} from "./MyRoomsVisibilityTabs";

type MyRoomsToolbarProps = {
  showVisibility: boolean;
  visibility: MyRoomsVisibilityFilter;
  onVisibilityChange: (value: MyRoomsVisibilityFilter) => void;
  showSearch: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateRoom: () => void;
};

export function MyRoomsToolbar({
  showVisibility,
  visibility,
  onVisibilityChange,
  showSearch,
  searchTerm,
  onSearchChange,
  onCreateRoom,
}: MyRoomsToolbarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative z-40 mb-10 flex flex-col gap-6 sm:flex-row sm:items-center",
        showVisibility ? "sm:justify-between" : "sm:justify-end",
      )}
    >
      {showVisibility ? (
        <MyRoomsVisibilityTabs value={visibility} onChange={onVisibilityChange} />
      ) : null}

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
        {showSearch ? (
          <div className="group relative w-full sm:w-80">
            <div className="absolute inset-0 bg-indigo-500/5 blur-lg transition-colors group-focus-within:bg-indigo-500/10" />
            <input
              type="text"
              placeholder="Search your rooms..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="relative w-full rounded-xl border border-white/5 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm font-medium text-white transition-all placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-indigo-400" />
          </div>
        ) : null}

        <CreateRoomButton
          size="compact"
          onClick={onCreateRoom}
          className="w-full shrink-0 sm:w-auto"
        />
      </div>
    </motion.div>
  );
}
