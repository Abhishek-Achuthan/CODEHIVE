import { Plus, Trash2 } from "lucide-react";

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
    <aside className="w-full lg:w-64 shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">My Lists</h2>
        <button
          type="button"
          onClick={onCreateList}
          className="px-3 py-1.5 rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground text-sm font-medium border border-white transition"
        >
          <Plus className="size-4" />
        </button>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={onSelectAll}
          className={`w-full text-left px-3 py-2 rounded-lg border transition ${
            selected.type === "all"
              ? "bg-primary/15 border-primary/40 text-foreground"
              : "border-border/30 text-foreground/70 hover:bg-card/40"
          }`}
        >
          All Saves
        </button>

        {listsLoading ? (
          <div className="text-sm text-foreground/60 px-3 py-2">Loading...</div>
        ) : lists.length === 0 ? (
          <div className="text-sm text-foreground/60 px-3 py-2">No lists yet</div>
        ) : (
          lists.map((l) => (
            <div
              key={l.id}
              className={`w-full px-3 py-2 rounded-lg border transition flex items-center justify-between gap-2 ${
                selected.type === "list" && selected.listId === l.id
                  ? "bg-primary/15 border-primary/40 text-foreground"
                  : "border-border/30 text-foreground/70 hover:bg-card/40"
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectList(l)}
                className="flex-1 text-left"
              >
                {l.name}
              </button>

              <button
                type="button"
                onClick={() => onDeleteList(l)}
                className="shrink-0 inline-flex items-center justify-center size-8 rounded-md hover:bg-background/30 transition"
                aria-label="Delete list"
                title="Delete list"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
