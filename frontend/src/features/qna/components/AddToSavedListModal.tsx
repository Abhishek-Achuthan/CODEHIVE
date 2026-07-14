import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../shared/ui/dialog/Dialog";

type SavedList = {
  id: string;
  name: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lists: SavedList[];
  onSelectList: (listId: string) => Promise<void>;
  onCreateNewList: () => void;
  loading?: boolean;
  addedListIds?: string[];
  addingToListId?: string | null;
};

export default function AddToSavedListModal({
  open,
  onOpenChange,
  lists,
  onSelectList,
  onCreateNewList,
  loading = false,
  addedListIds = [],
  addingToListId = null,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-zinc-800 bg-[#121214] sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-zinc-100 text-lg">Add to list</DialogTitle>
          <DialogDescription className="text-zinc-400 text-sm">
            Choose a list to add this question.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 mt-4 mb-6 max-h-72 overflow-y-auto pr-1">
          {loading ? (
            <div className="text-sm text-zinc-500 py-4 text-center">Loading...</div>
          ) : lists.length === 0 ? (
            <div className="text-sm text-zinc-500 py-4 text-center">No lists yet.</div>
          ) : (
            lists.map((l) => {
              const isAdded = addedListIds.includes(l.id);
              const isAdding = addingToListId === l.id;
              const disabled = isAdded || Boolean(addingToListId);

              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => onSelectList(l.id)}
                  disabled={disabled}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-colors flex items-center justify-between text-sm ${
                    isAdded
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-100"
                      : "border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-700 text-zinc-200"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className="font-medium truncate pr-4">{l.name}</span>
                  {isAdding ? (
                    <span className="text-[11px] text-zinc-400 font-medium shrink-0">Adding...</span>
                  ) : isAdded ? (
                    <span className="text-[11px] text-emerald-400 font-medium shrink-0">Added</span>
                  ) : null}
                </button>
              );
            })
          )}
        </div>

        <DialogFooter className="gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-lg border border-zinc-800 bg-transparent text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onCreateNewList}
            disabled={Boolean(addingToListId)}
            className="px-5 py-2 rounded-lg bg-zinc-800 text-zinc-100 text-sm font-medium hover:bg-zinc-700 hover:text-white transition-colors border border-zinc-700 disabled:opacity-50"
          >
            Create new list
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
