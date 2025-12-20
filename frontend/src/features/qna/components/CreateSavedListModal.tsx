import { useEffect, useState } from "react";

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
  onCreate: (name: string) => Promise<void>;
};

export default function CreateSavedListModal({
  open,
  onOpenChange,
  onCreate,
}: Props) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName("");
      setSubmitting(false);
    }
  }, [open]);

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    try {
      setSubmitting(true);
      await onCreate(trimmed);
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border/50 bg-background/95 backdrop-blur-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create new list</DialogTitle>
          <DialogDescription>
            Give your list a name to organize saved questions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label className="text-sm text-foreground/80">List name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. React Interview"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
          />
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-lg border border-border text-sm text-foreground/80 hover:bg-card/80"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={submitting || !name.trim()}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 border border-white disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating..." : "Create"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
