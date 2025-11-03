import { AxiosError } from "axios";
import { useState } from "react";

export function useOTP<TValues extends Record<string, unknown>>(
  onSend: (data: Partial<TValues>) => Promise<void>,
  onVerify: (otp: string, values: TValues) => Promise<boolean>,
  otpVia: keyof TValues
) {
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpActiveFor, setOtpActiveFor] = useState<string | null>(null);

  const handleSubmit = async (values: TValues): Promise<void> => {
    const recipient = values[otpVia];
    if (!recipient) return;

    if (otpActiveFor === recipient) {
      setOtpModalOpen(true);
      return;
    }

    try {
      await onSend({ [otpVia]: recipient } as Partial<TValues>);
      setOtpActiveFor(recipient as string);
    } catch (error) {
      if (error instanceof AxiosError) {
        const msg = error?.response?.data?.message ?? "";
        if (
          msg.toLowerCase().includes("already") ||
          error?.response?.status === 429
        ) {
          setOtpActiveFor(recipient as string);
        } else {
          throw error;
        }
      }
    }

    setOtpModalOpen(true);
  };

  const handleResend = async (values: TValues): Promise<void> => {
    const recipient = values[otpVia];
    if (!recipient) return;

    try {
      await onSend({ [otpVia]: recipient } as Partial<TValues>);
      setOtpActiveFor(recipient as string);
    } catch (error) {
      console.log(error)
    }

    setOtpModalOpen(true);
  };

  const handleVerifyOtp = async (
    otp: string,
    values: TValues
  ): Promise<void> => {
    const isVerified = await onVerify(otp, values);
    if (isVerified) {
      setOtpModalOpen(false);
      setOtpActiveFor(null);
    }
  };

  return {
    otpModalOpen,
    setOtpModalOpen,
    handleSubmit,
    handleResend,
    handleVerifyOtp,
  };
}
