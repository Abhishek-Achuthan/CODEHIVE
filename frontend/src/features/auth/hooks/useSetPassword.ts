import { useState } from "react";
import { AuthService } from "../../../services/authService";
import { BaseError } from "../../../shared/errors/BaseError";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../../shared/hooks/storeHooks";
import { setCurrentUser } from "../../../store/slices/authSlice";

interface SetPasswordParams {
  newPass: string;
  confirmNewPass: string;
}

export function useSetPassword(onSuccess?: () => void) {
  const [saving, setSaving] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const setPassword = async ({
    newPass,
    confirmNewPass,
  }: SetPasswordParams) => {
    if (saving) return;

    const next = newPass.trim();
    const confirm = confirmNewPass.trim();

    if (!next || !confirm) {
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
      const res = await AuthService.setPassword({ newPass: next });

      const message =
        typeof res?.message === "string" && res.message.trim().length > 0
          ? res.message
          : "Password set successfully";

      toast.success(message);
      
      if (user) {
        dispatch(setCurrentUser({ ...user, hasPassword: true }));
      }

      onSuccess?.();
    } catch (error) {
      if (error instanceof BaseError) toast.error(error.message);
      else if (error instanceof Error) toast.error(error.message);
      else toast.error("Failed to set password");
    } finally {
      setSaving(false);
    }
  };

  return { setPassword, saving };
}
