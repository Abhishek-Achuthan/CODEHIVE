import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useOTP<
  TOtpVia extends string,
  TValues extends Record<TOtpVia, string> & Record<string, unknown>
>(
  onSend: (data: Pick<TValues, TOtpVia>) => Promise<void>,
  onVerify: (otp: string, values: TValues) => Promise<boolean>,
  otpVia: TOtpVia
) {
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpActiveFor, setOtpActiveFor] = useState<string | null>(null);
  const navigate = useNavigate();

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
      const payload = { [otpVia]: recipient } as Pick<TValues, TOtpVia>;
      await onSend(payload);
      setOtpActiveFor(recipient);
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
      const payload = { [otpVia]: recipient } as Pick<TValues, TOtpVia>;
      await onSend(payload);
      setOtpActiveFor(recipient);
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
      navigate('/login');
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
