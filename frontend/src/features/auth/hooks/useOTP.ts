import { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

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
      setOtpModalOpen(true);
    } catch (error) {
      console.log(error)
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message)
        const status = error?.response?.status;
        if (status === 429) {
          setOtpActiveFor(recipient as string);
          setOtpModalOpen(true);
        } else {
          throw error;
        }
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
