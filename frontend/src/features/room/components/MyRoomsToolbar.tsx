import { Search, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../../shared/utils/classNames";
import { CreateRoomButton } from "./CreateRoomButton";
import { DatePicker, CustomProvider } from 'rsuite';
import 'rsuite/dist/rsuite-no-reset.min.css';
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
  dateFilter?: string;
  onDateFilterChange?: (value: string) => void;
  statusFilter?: string;
  onStatusFilterChange?: (value: string) => void;
  onCreateRoom: () => void;
  leftSlot?: React.ReactNode;
  searchPlaceholder?: string;
};

export function MyRoomsToolbar({
  showVisibility,
  visibility,
  onVisibilityChange,
  showSearch,
  searchTerm,
  onSearchChange,
  dateFilter = "",
  onDateFilterChange,
  statusFilter = "",
  onStatusFilterChange,
  onCreateRoom,
  leftSlot,
  searchPlaceholder = "Search rooms...",
}: MyRoomsToolbarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative z-40 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {leftSlot}
        {showVisibility ? (
          <MyRoomsVisibilityTabs value={visibility} onChange={onVisibilityChange} />
        ) : null}
      </div>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
        {onStatusFilterChange && (
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="appearance-none w-full sm:w-auto rounded-xl border border-white/5 bg-white/[0.03] py-2.5 pl-4 pr-10 text-sm font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="" className="bg-zinc-900">All Status</option>
              <option value="ACTIVE" className="bg-zinc-900">Active</option>
              <option value="INACTIVE" className="bg-zinc-900">Inactive</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          </div>
        )}
        {onDateFilterChange && (
          <div className="relative z-50">
            <CustomProvider theme="dark">
              <DatePicker
                format="yyyy-MM-dd"
                value={dateFilter ? new Date(dateFilter) : null}
                shouldDisableDate={(date) => date > new Date()}
                onChange={(v) => {
                  if (v) {
                    if (Number.isNaN(v.getTime())) {
                      return;
                    }
                    const yyyy = v.getFullYear();
                    const mm = String(v.getMonth() + 1).padStart(2, '0');
                    const dd = String(v.getDate()).padStart(2, '0');
                    onDateFilterChange(`${yyyy}-${mm}-${dd}`);
                  } else {
                    onDateFilterChange("");
                  }
                }}
                onClean={() => onDateFilterChange("")}
                placeholder="Any Time"
                appearance="subtle"
                style={{
                  width: '100%',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  color: 'white'
                }}
                className="w-full sm:w-[200px]"
              />
            </CustomProvider>
          </div>
        )}

        {showSearch ? (
          <div className="group relative w-full sm:w-60">
            <div className="absolute inset-0 bg-indigo-500/5 blur-lg transition-colors group-focus-within:bg-indigo-500/10" />
            <input
              type="text"
              placeholder={searchPlaceholder}
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
