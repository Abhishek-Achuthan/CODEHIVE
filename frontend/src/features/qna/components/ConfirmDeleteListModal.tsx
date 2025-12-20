import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../shared/ui/dialog/Dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listName: string;
  onConfirm: () => Promise<void>;
  loading?: boolean;
};

export default function ConfirmDeleteListModal({
  open,
  onOpenChange,
  listName,
  onConfirm,
  loading = false,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border/50 bg-background/95 backdrop-blur-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete list</DialogTitle>
          <DialogDescription>
            This will delete <span className="font-medium">{listName}</span> and all
            items inside it.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-border text-sm text-foreground/80 hover:bg-card/80 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 border border-white disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
