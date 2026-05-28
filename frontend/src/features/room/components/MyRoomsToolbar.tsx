import { motion } from "framer-motion";
import { SearchInput } from "../../qna/components/SearchInput";
import {
  MyRoomsVisibilityTabs,
  type MyRoomsVisibilityFilter,
} from "./MyRoomsVisibilityTabs";

type MyRoomsToolbarProps = {
  visibility: MyRoomsVisibilityFilter;
  onVisibilityChange: (value: MyRoomsVisibilityFilter) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
};

export function MyRoomsToolbar({
  visibility,
  onVisibilityChange,
  searchTerm,
  onSearchChange,
}: MyRoomsToolbarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <MyRoomsVisibilityTabs value={visibility} onChange={onVisibilityChange} />

      <SearchInput
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search your rooms..."
        className="mb-0 w-full sm:w-72"
      />
    </motion.div>
  );
}
