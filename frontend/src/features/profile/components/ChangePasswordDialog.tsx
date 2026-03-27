import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../shared/ui/dialog/Dialog";

import { useChangePassword } from "../../auth/hooks/useChangePassword";

export interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ChangePasswordDialog({
  open,
  onOpenChange,
}: ChangePasswordDialogProps) {
  const [previousPass, setPreviousPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");

  const { changePassword, saving } = useChangePassword(() => onOpenChange(false));

  useEffect(() => {
    if (!open) {
      setPreviousPass("");
      setNewPass("");
      setConfirmNewPass("");
    }
  }, [open]);

  const submit = async () => {
    await changePassword({ previousPass, newPass, confirmNewPass });
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-gray-800 bg-black text-white">
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <label className="grid gap-1">
            <span className="text-xs text-gray-400">Current password</span>
            <input
              type="password"
              value={previousPass}
              onChange={(e) => setPreviousPass(e.target.value)}
              className="h-10 rounded-md border border-gray-700 bg-black px-3 text-sm outline-none focus:ring-2 focus:ring-blue-600/40"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-gray-400">New password</span>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="h-10 rounded-md border border-gray-700 bg-black px-3 text-sm outline-none focus:ring-2 focus:ring-blue-600/40"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-gray-400">Confirm new password</span>
            <input
              type="password"
              value={confirmNewPass}
              onChange={(e) => setConfirmNewPass(e.target.value)}
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
