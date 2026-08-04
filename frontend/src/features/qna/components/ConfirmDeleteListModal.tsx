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
      <DialogContent className="border-zinc-800 bg-[#121214] sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-zinc-100 text-lg">Delete list</DialogTitle>
          <DialogDescription className="text-zinc-400 text-sm mt-2">
            This will delete <span className="font-semibold text-zinc-200">{listName}</span> and all
            items inside it. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-3 mt-6">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-zinc-800 bg-transparent text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-500 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Deleting..." : "Delete List"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
