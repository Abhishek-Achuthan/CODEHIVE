import { useState } from "react";
import { AuthService } from "../../../services/authService";
import { BaseError } from "../../../shared/errors/BaseError";
import toast from "react-hot-toast";

interface ChangePasswordParams {
  previousPass: string;
  newPass: string;
  confirmNewPass: string;
}

export function useChangePassword(onSuccess?: () => void) {
  const [saving, setSaving] = useState(false);

  const changePassword = async ({
    previousPass,
    newPass,
    confirmNewPass,
  }: ChangePasswordParams) => {
    if (saving) return;

    const prev = previousPass.trim();
    const next = newPass.trim();
    const confirm = confirmNewPass.trim();

    if (!prev || !next || !confirm) {
      toast.error("All fields are required");
      return;
    }

    if (next.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (next !== confirm) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setSaving(true);
      const res = await AuthService.changePassword({ previousPass: prev, newPass: next });

      const message =
        typeof res?.message === "string" && res.message.trim().length > 0
          ? res.message
          : "Password changed";

      toast.success(message);
      onSuccess?.();
    } catch (error) {
      if (error instanceof BaseError) toast.error(error.message);
      else if (error instanceof Error) toast.error(error.message);
      else toast.error("Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  return { changePassword, saving };
}
