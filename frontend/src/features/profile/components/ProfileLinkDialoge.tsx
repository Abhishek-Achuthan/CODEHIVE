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
      <DialogContent className="border border-zinc-800 bg-[#121214] text-zinc-100 p-0 overflow-hidden sm:max-w-md shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b border-zinc-800 bg-[#09090b]/50">
          <DialogTitle className="text-lg font-semibold tracking-tight">Edit Profile Links</DialogTitle>
        </DialogHeader>

        <div className="p-6 grid gap-5">
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-zinc-300">GitHub Profile</span>
            <input
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username"
              className="h-10 w-full rounded-lg border border-zinc-800 bg-[#09090b] px-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-zinc-300">LinkedIn Profile</span>
            <input
              value={linkedInUrl}
              onChange={(e) => setLinkedInUrl(e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="h-10 w-full rounded-lg border border-zinc-800 bg-[#09090b] px-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-zinc-300">Personal Website</span>
            <input
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="h-10 w-full rounded-lg border border-zinc-800 bg-[#09090b] px-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
            />
          </label>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-zinc-800 bg-[#09090b]/50 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors w-full sm:w-auto"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            className="w-full sm:w-auto rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors shadow-sm disabled:opacity-50"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Links"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
