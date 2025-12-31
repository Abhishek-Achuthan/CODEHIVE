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
  title: string;
  description: string;
  confirmText: string;
  onConfirm: () => Promise<void>;
  loading?: boolean;
};

export default function ConfirmAcceptedAnswerModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  onConfirm,
  loading = false,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border/50 bg-background/95 backdrop-blur-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
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
            className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 border border-white disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
