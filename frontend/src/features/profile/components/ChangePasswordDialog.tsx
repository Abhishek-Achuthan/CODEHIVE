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
      <DialogContent className="border border-zinc-800 bg-[#121214] text-zinc-100 p-0 overflow-hidden sm:max-w-md shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b border-zinc-800 bg-[#09090b]/50">
          <DialogTitle className="text-lg font-semibold tracking-tight">Change Password</DialogTitle>
        </DialogHeader>

        <div className="p-6 grid gap-5">
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-zinc-300">Current Password</span>
            <input
              type="password"
              value={previousPass}
              onChange={(e) => setPreviousPass(e.target.value)}
              className="h-10 w-full rounded-lg border border-zinc-800 bg-[#09090b] px-4 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-zinc-300">New Password</span>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="h-10 w-full rounded-lg border border-zinc-800 bg-[#09090b] px-4 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-zinc-300">Confirm New Password</span>
            <input
              type="password"
              value={confirmNewPass}
              onChange={(e) => setConfirmNewPass(e.target.value)}
              className="h-10 w-full rounded-lg border border-zinc-800 bg-[#09090b] px-4 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
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
            {saving ? "Saving..." : "Update Password"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
