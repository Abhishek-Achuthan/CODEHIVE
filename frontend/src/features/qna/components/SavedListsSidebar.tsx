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
    <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-8">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-3">Overview</h2>
        <button
          type="button"
          onClick={onSelectAll}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            selected.type === "all"
              ? "bg-zinc-800 text-zinc-100"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
          }`}
        >
          <Bookmark className="size-4" />
          <span className="font-medium text-sm">All Saves</span>
        </button>
      </div>

      <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
        <h2 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-3">My Lists</h2>
        
        <div className="space-y-1 overflow-y-auto">
          {listsLoading ? (
            <div className="text-sm text-zinc-500 px-3 py-2 animate-pulse">Loading lists...</div>
          ) : lists.length === 0 ? (
            <div className="text-sm text-zinc-500 px-3 py-2 italic">No lists yet</div>
          ) : (
            lists.map((l) => (
              <div
                key={l.id}
                className={`w-full group rounded-lg transition-colors flex items-center justify-between overflow-hidden ${
                  selected.type === "list" && selected.listId === l.id
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectList(l)}
                  className="flex-1 flex items-center gap-3 px-3 py-2 text-left min-w-0"
                >
                  <List className="size-4 shrink-0" />
                  <span className="font-medium text-sm truncate">{l.name}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteList(l)}
                  className="shrink-0 inline-flex items-center justify-center size-8 mr-1 rounded-md text-zinc-500 hover:bg-rose-500/10 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-colors"
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
          className="w-full flex items-center justify-center gap-2 px-3 py-2 mt-4 rounded-lg border border-dashed border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800/50 text-sm font-medium transition-colors"
        >
          <Plus className="size-4" />
          Create New List
        </button>
      </div>
    </aside>
  );
}
