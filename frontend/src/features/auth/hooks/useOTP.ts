import { useState } from 'react';
import toast from 'react-hot-toast';

export function useOTP<TValues extends Record<string, unknown>>(
  onSend: (data: Partial<TValues>) => Promise<void>,
  onVerify: (otp: string, values: TValues) => Promise<boolean>,
  otpVia: keyof TValues
) {
  const [otpModalOpen, setOtpModalOpen] = useState(false);

  const handleSubmit = async (values: TValues): Promise<void> => {
    const contactValue = values[otpVia];
    if (!contactValue) {
      toast.error(`Please provide a valid ${String(otpVia)}`);
      return;
    }

    await onSend({ [otpVia]: contactValue } as Partial<TValues>);
    setOtpModalOpen(true);
  };

  const handleResend = async (values: TValues): Promise<void> => {
    const contactValue = values[otpVia];
    if (!contactValue) {
      toast.error(`Please provide a valid ${String(otpVia)}`);
      return;
    }

    await onSend({ [otpVia]: contactValue } as Partial<TValues>);
  };

  const handleVerifyOtp = async (otp: string, values: TValues): Promise<void> => {
    const isVerified = await onVerify(otp, values);
    if (isVerified) setOtpModalOpen(false);
  };

  return {
    otpModalOpen,
    setOtpModalOpen,
    handleSubmit,
    handleResend,
    handleVerifyOtp,
  };
}
