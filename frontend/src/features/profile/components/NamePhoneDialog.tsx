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
      <DialogContent className="border border-gray-800 bg-black text-white">
        <DialogHeader>
          <DialogTitle>Name & Phone</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <label className="grid gap-1">
            <span className="text-xs text-gray-400">First name</span>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="h-10 rounded-md border border-gray-700 bg-black px-3 text-sm outline-none focus:ring-2 focus:ring-blue-600/40"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-gray-400">Last name</span>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="h-10 rounded-md border border-gray-700 bg-black px-3 text-sm outline-none focus:ring-2 focus:ring-blue-600/40"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-gray-400">Phone</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91..."
              className="h-10 rounded-md border border-gray-700 bg-black px-3 text-sm outline-none focus:ring-2 focus:ring-blue-600/40"
            />
          </label>
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
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
