import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../shared/ui/dialog/Dialog";

import { BaseError } from "../../../shared/errors/BaseError";

export interface ProfileHeaderEditDialogValues {
  firstName: string;
  lastName: string;
  phone?: string;
  githubUrl?: string;
  linkedInUrl?: string;
  websiteUrl?: string;
  avatarUrl?: string;
}

export interface ProfileHeaderEditDialogProps {
  open: boolean;
  initialValues: ProfileHeaderEditDialogValues;
  onOpenChange: (open: boolean) => void;
  onSave: (values: ProfileHeaderEditDialogValues) => Promise<void>;
}

export default function ProfileHeaderEditDialog({
  open,
  initialValues,
  onOpenChange,
  onSave,
}: ProfileHeaderEditDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [githubUrl, setGithubUrl] = useState("");
  const [linkedInUrl, setLinkedInUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    setFirstName(initialValues.firstName ?? "");
    setLastName(initialValues.lastName ?? "");
    setPhone(initialValues.phone ?? "");

    setGithubUrl(initialValues.githubUrl ?? "");
    setLinkedInUrl(initialValues.linkedInUrl ?? "");
    setWebsiteUrl(initialValues.websiteUrl ?? "");

    setSaving(false);
  }, [open, initialValues]);

  const submit = async () => {
    try {
      if (saving) return;

      const nextFirstName = firstName.trim();
      const nextLastName = lastName.trim();
      const nextPhone = phone.trim();

      if (!nextFirstName || !nextLastName) {
        toast.error("First name and last name are required");
        return;
      }

      setSaving(true);

      await onSave({
        firstName: nextFirstName,
        lastName: nextLastName,
        phone: nextPhone.length ? nextPhone : undefined,
        githubUrl: githubUrl.trim() || undefined,
        linkedInUrl: linkedInUrl.trim() || undefined,
        websiteUrl: websiteUrl.trim() || undefined,
      });

      toast.success("Profile updated");
      onOpenChange(false);
    } catch (error) {
      if (error instanceof BaseError) toast.error(error.message);
      else if (error instanceof Error) toast.error(error.message);
      else toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-zinc-800 bg-[#121214] text-zinc-100 p-0 overflow-hidden sm:max-w-xl shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b border-zinc-800 bg-[#09090b]/50">
          <DialogTitle className="text-lg font-semibold tracking-tight">Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="p-6 grid gap-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <section className="grid gap-4">
            <div className="text-[13px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Personal Information
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="grid gap-1.5">
                <span className="text-sm font-medium text-zinc-300">First Name</span>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-10 w-full rounded-lg border border-zinc-800 bg-[#09090b] px-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
                />
              </label>

              <label className="grid gap-1.5">
                <span className="text-sm font-medium text-zinc-300">Last Name</span>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-10 w-full rounded-lg border border-zinc-800 bg-[#09090b] px-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
                />
              </label>
            </div>

            <label className="grid gap-1.5 mt-1">
              <span className="text-sm font-medium text-zinc-300">Phone Number</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="h-10 w-full rounded-lg border border-zinc-800 bg-[#09090b] px-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
              />
            </label>
          </section>

          <div className="h-px w-full bg-zinc-800/50" />

          <section className="grid gap-4">
            <div className="text-[13px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Social Links
            </div>

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
          </section>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-zinc-800 bg-[#09090b]/50 flex gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
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
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
