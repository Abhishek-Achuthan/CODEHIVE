import { useState } from 'react';
import toast from 'react-hot-toast';

export function useOTP<TValues extends Record<string, unknown>>(
  onSend: (data: Partial<TValues>) => Promise<void>,
  onVerify: (otp: string, values: TValues) => Promise<boolean>,
  otpVia: keyof TValues
): {
  otpModalOpen: boolean;
  setOtpModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: (values: TValues) => Promise<void>;
  handleVerifyOtp: (otp: string, values: TValues) => Promise<void>;
} {
  const [otpModalOpen, setOtpModalOpen] = useState(false);

  const handleSubmit = async (values: TValues): Promise<void> => {
    try {
      const contactValue = values[otpVia];
      if (!contactValue) {
        toast.error(`Missing ${String(otpVia)} for OTP sending`);
        throw new Error(`Missing ${String(otpVia)} for OTP sending`);
      }

      setOtpModalOpen(true);
      await onSend({ [otpVia]: contactValue } as Partial<TValues>);
      toast.success(`OTP sent to your ${String(otpVia)}`);
    } catch (error) {
      console.error('Error while sending OTP:', error);
      toast.error(`Failed to send OTP to your ${String(otpVia)}.`);
      setOtpModalOpen(false);
    }
  };

  const handleVerifyOtp = async (otp: string, values: TValues): Promise<void> => {
    try {
      const isVerified = await onVerify(otp, values);
      if (isVerified) {
        setOtpModalOpen(false);
      } else {
        console.warn('OTP verification failed: invalid OTP');
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
    }
  };

  return {
    otpModalOpen,
    setOtpModalOpen,
    handleSubmit,
    handleVerifyOtp,
  };
}
