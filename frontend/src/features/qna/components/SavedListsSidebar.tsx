import { Plus, Trash2, List, Bookmark } from "lucide-react";

type SavedList = {
  id: string;
  name: string;
};

type SelectedTab =
  | { type: "all" }
  | { type: "list"; listId: string; name: string };

type Props = {
  listsLoading: boolean;
  lists: SavedList[];
  selected: SelectedTab;
  onSelectAll: () => void;
  onSelectList: (l: SavedList) => void;
  onCreateList: () => void;
  onDeleteList: (l: SavedList) => void;
};

export default function SavedListsSidebar({
  listsLoading,
  lists,
  selected,
  onSelectAll,
  onSelectList,
  onCreateList,
  onDeleteList,
}: Props) {
  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">Overview</h2>
        <button
          type="button"
          onClick={onSelectAll}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-300 ${
            selected.type === "all"
              ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-[0_0_15px_rgba(79,70,229,0.1)]"
              : "border-transparent text-gray-400 hover:text-gray-200 hover:bg-zinc-800/50"
          }`}
        >
          <Bookmark className="size-4" />
          <span className="font-medium text-sm">All Saves</span>
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">My Lists</h2>
        
        <div className="space-y-1.5 flex-1 overflow-y-auto">
          {listsLoading ? (
            <div className="text-sm text-gray-500 px-3 py-2 animate-pulse">Loading lists...</div>
          ) : lists.length === 0 ? (
            <div className="text-sm text-gray-500 px-3 py-2 italic">No lists yet</div>
          ) : (
            lists.map((l) => (
              <div
                key={l.id}
                className={`w-full group rounded-xl border transition-all duration-300 flex items-center justify-between gap-1 overflow-hidden ${
                  selected.type === "list" && selected.listId === l.id
                    ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-[0_0_15px_rgba(79,70,229,0.1)]"
                    : "border-transparent text-gray-400 hover:text-gray-200 hover:bg-zinc-800/50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectList(l)}
                  className="flex-1 flex items-center gap-3 px-3 py-2.5 text-left"
                >
                  <List className="size-4 shrink-0" />
                  <span className="font-medium text-sm truncate">{l.name}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteList(l)}
                  className="shrink-0 inline-flex items-center justify-center size-8 mr-1 rounded-lg text-gray-500 hover:bg-red-500/10 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  aria-label="Delete list"
                  title="Delete list"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <button
          type="button"
          onClick={onCreateList}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 mt-2 rounded-xl border border-dashed border-gray-600/50 text-gray-400 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/5 text-sm font-medium transition-all duration-300"
        >
          <Plus className="size-4" />
          Create New List
        </button>
      </div>
    </aside>
  );
}
