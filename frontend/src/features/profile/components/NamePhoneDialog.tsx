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

export interface NamePhoneDialogValues {
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface NamePhoneDialogProps {
  open: boolean;
  initialValues: NamePhoneDialogValues;
  onOpenChange: (open: boolean) => void;
  onSave: (values: NamePhoneDialogValues) => Promise<void>;
}

export default function NamePhoneDialog({
  open,
  initialValues,
  onOpenChange,
  onSave,
}: NamePhoneDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    setFirstName(initialValues.firstName ?? "");
    setLastName(initialValues.lastName ?? "");
    setPhone(initialValues.phone ?? "");
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
      <DialogContent className="border border-zinc-800 bg-[#121214] text-zinc-100 p-0 overflow-hidden sm:max-w-md shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b border-zinc-800 bg-[#09090b]/50">
          <DialogTitle className="text-lg font-semibold tracking-tight">Name & Phone</DialogTitle>
        </DialogHeader>

        <div className="p-6 grid gap-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-zinc-300">First Name</span>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="h-10 w-full rounded-lg border border-zinc-800 bg-[#09090b] px-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-zinc-300">Last Name</span>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
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
