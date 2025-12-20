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
      <DialogContent className="border-border/50 bg-background/95 backdrop-blur-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to list</DialogTitle>
          <DialogDescription>
            Choose a list to add this question.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-72 overflow-auto">
          {loading ? (
            <div className="text-sm text-foreground/60">Loading...</div>
          ) : lists.length === 0 ? (
            <div className="text-sm text-foreground/60">No lists yet.</div>
          ) : (
            lists.map((l) => (
              (() => {
                const isAdded = addedListIds.includes(l.id);
                const isAdding = addingToListId === l.id;
                const disabled = isAdded || Boolean(addingToListId);

                return (
              <button
                key={l.id}
                type="button"
                onClick={() => onSelectList(l.id)}
                disabled={disabled}
                className={`w-full text-left px-3 py-2 rounded-lg border transition text-sm flex items-center justify-between ${
                  isAdded
                    ? "border-primary/30 bg-primary/10 text-foreground/70"
                    : "border-border/40 hover:bg-card/60"
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                <span>{l.name}</span>
                {isAdding ? (
                  <span className="text-xs text-foreground/60">Adding...</span>
                ) : isAdded ? (
                  <span className="text-xs text-primary">Added</span>
                ) : null}
              </button>
                );
              })()
            ))
          )}
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-lg border border-border text-sm text-foreground/80 hover:bg-card/80"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onCreateNewList}
            disabled={Boolean(addingToListId)}
            className="px-4 py-2 rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground text-sm font-medium transition border border-white"
          >
            Create new list
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
