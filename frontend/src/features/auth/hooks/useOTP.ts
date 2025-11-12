import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function useOTP<TValues extends Record<string, unknown>>(
  onSend: (data: Partial<TValues>) => Promise<void>,
  onVerify: (otp: string, values: TValues) => Promise<boolean>,
  otpVia: keyof TValues
) {
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpActiveFor, setOtpActiveFor] = useState<string | null>(null);

  useEffect(() => {
    if (!otpModalOpen) {
      setOtpActiveFor(null);
    }
  }, [otpModalOpen]);

  const handleSubmit = async (values: TValues): Promise<void> => {
    const recipient = values[otpVia];
    if (!recipient) return;

    if (otpActiveFor && otpActiveFor !== recipient) {
      setOtpActiveFor(null);
      setOtpModalOpen(false);
    }

    try {
      await onSend({ [otpVia]: recipient } as Partial<TValues>);
      setOtpActiveFor(recipient as string);
      setOtpModalOpen(true);
    } catch (error) {
      setOtpActiveFor(null);
      setOtpModalOpen(false);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to send OTP");
      }
    }
  };

  const handleResend = async (values: TValues): Promise<void> => {
    const recipient = values[otpVia];
    if (!recipient) return;

    try {
      await onSend({ [otpVia]: recipient } as Partial<TValues>);
      setOtpActiveFor(recipient as string);
    } catch (error) {
      console.log(error);
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
