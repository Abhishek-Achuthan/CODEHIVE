import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../shared/ui/dialog/Dialog";

interface EndRoomDialogProps {
  open: boolean;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export function EndRoomDialog({
  open,
  loading = false,
  onConfirm,
  onClose,
}: EndRoomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => (!nextOpen ? onClose() : undefined)}>
      <DialogContent className="border border-gray-800 bg-black text-white">
        <DialogHeader>
          <DialogTitle>End Room</DialogTitle>
          <DialogDescription className="text-sm text-gray-400">
            This will close the room and prevent further collaboration. Existing room
            content will remain available in read-only mode.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-md border border-gray-600 px-4 py-2 text-xs text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void onConfirm()}
            disabled={loading}
            className="rounded-md bg-red-600 px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Ending..." : "End Room"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
