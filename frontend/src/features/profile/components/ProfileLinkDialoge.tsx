import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../shared/ui/dialog/Dialog";

export interface ProfileLinksDialogProps {
  open: boolean;
  initialValues: {
    githubUrl?: string;
    linkedInUrl?: string;
    websiteUrl?: string;
  };
  onCancel: () => void;
  onSave: (values: {
    githubUrl?: string;
    linkedInUrl?: string;
    websiteUrl?: string;
  }) => void | Promise<void>;
}

export default function ProfileLinksDialog({
  open,
  initialValues,
  onCancel,
  onSave,
}: ProfileLinksDialogProps) {
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedInUrl, setLinkedInUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setGithubUrl(initialValues.githubUrl ?? "");
      setLinkedInUrl(initialValues.linkedInUrl ?? "");
      setWebsiteUrl(initialValues.websiteUrl ?? "");
      setSaving(false);
    }
  }, [open, initialValues]);

  const submit = async () => {
    if (saving) return;

    try {
      setSaving(true);
      await onSave({
        githubUrl: githubUrl.trim() || undefined,
        linkedInUrl: linkedInUrl.trim() || undefined,
        websiteUrl: websiteUrl.trim() || undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => (!nextOpen ? onCancel() : undefined)}>
      <DialogContent className="border border-gray-800 bg-black text-white">
        <DialogHeader>
          <DialogTitle>Edit profile links</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <label className="grid gap-1">
            <span className="text-xs text-gray-400">GitHub</span>
            <input
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="h-10 rounded-md border border-gray-700 bg-black px-3 text-sm"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-gray-400">LinkedIn</span>
            <input
              value={linkedInUrl}
              onChange={(e) => setLinkedInUrl(e.target.value)}
              className="h-10 rounded-md border border-gray-700 bg-black px-3 text-sm"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-gray-400">Website</span>
            <input
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="h-10 rounded-md border border-gray-700 bg-black px-3 text-sm"
            />
          </label>
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-600 px-4 py-2 text-xs"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            className="rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
