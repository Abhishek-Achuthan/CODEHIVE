import { useEffect, useMemo, useState } from "react";

export interface OtpSendResult {
  success: true;
  expiryTimestamp: number;
}

interface StoredOtpSession {
  otpSessionActive: boolean;
  otpTarget: string | null;
  otpExpiryTimestamp: number | null;
  otpModalOpen: boolean;
  otpSessionVersion: number;
}

const DEFAULT_OTP_SESSION: StoredOtpSession = {
  otpSessionActive: false,
  otpTarget: null,
  otpExpiryTimestamp: null,
  otpModalOpen: false,
  otpSessionVersion: 0,
};

export function useOTP<
  TOtpVia extends string,
  TValues extends Record<TOtpVia, string> & Record<string, unknown>
>(
  onSend: (data: Pick<TValues, TOtpVia>) => Promise<OtpSendResult>,
  onVerify: (otp: string, values: TValues) => Promise<boolean>,
  otpVia: TOtpVia,
  storageKey: string
) {
  const [otpSession, setOtpSession] = useState<StoredOtpSession>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_OTP_SESSION;
    }

    const stored = window.localStorage.getItem(storageKey);
    if (!stored) {
      return DEFAULT_OTP_SESSION;
    }

    try {
      const parsed = JSON.parse(stored) as Partial<StoredOtpSession>;
      return {
        otpSessionActive: parsed.otpSessionActive ?? false,
        otpTarget: parsed.otpTarget ?? null,
        otpExpiryTimestamp: parsed.otpExpiryTimestamp ?? null,
        otpModalOpen: parsed.otpSessionActive ? true : false,
        otpSessionVersion: parsed.otpSessionVersion ?? 0,
      };
    } catch {
      window.localStorage.removeItem(storageKey);
      return DEFAULT_OTP_SESSION;
    }
  });
  const [currentTimestamp, setCurrentTimestamp] = useState(() => Date.now());
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!otpSession.otpSessionActive) {
      window.localStorage.removeItem(storageKey);
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(otpSession));
  }, [otpSession, storageKey]);

  useEffect(() => {
    if (!otpSession.otpSessionActive || !otpSession.otpExpiryTimestamp) {
      return;
    }

    setCurrentTimestamp(Date.now());

    const intervalId = window.setInterval(() => {
      const now = Date.now();
      setCurrentTimestamp(now);
      
      // Clear session if it's been expired for more than 7 minutes (420000ms)
      if (now > otpSession.otpExpiryTimestamp! + 7 * 60 * 1000) {
        setOtpSession(DEFAULT_OTP_SESSION);
      }
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [otpSession.otpSessionActive, otpSession.otpExpiryTimestamp]);

  const timeLeftMs = useMemo(() => {
    if (!otpSession.otpExpiryTimestamp) {
      return 0;
    }

    return Math.max(otpSession.otpExpiryTimestamp - currentTimestamp, 0);
  }, [currentTimestamp, otpSession.otpExpiryTimestamp]);
  const timeLeftSeconds = Math.max(Math.ceil(timeLeftMs / 1000), 0);

  const clearOtpSession = () => {
    setOtpSession(DEFAULT_OTP_SESSION);
    setCurrentTimestamp(Date.now());
  };

  const handleSubmit = async (values: TValues): Promise<void> => {
    const recipient = values[otpVia];
    if (!recipient) return;

    if (
      otpSession.otpSessionActive &&
      otpSession.otpTarget === recipient &&
      otpSession.otpExpiryTimestamp &&
      otpSession.otpExpiryTimestamp > Date.now()
    ) {
      setOtpSession((prev) => ({
        ...prev,
        otpModalOpen: true,
      }));
      return;
    }

    const payload = { [otpVia]: recipient } as Pick<TValues, TOtpVia>;
    const result = await onSend(payload);

    if (!result.success) {
      return;
    }

    setOtpSession((prev) => ({
      otpSessionActive: true,
      otpTarget: recipient,
      otpExpiryTimestamp: result.expiryTimestamp,
      otpModalOpen: true,
      otpSessionVersion: prev.otpSessionVersion + 1,
    }));
    setCurrentTimestamp(Date.now());
  };

  const handleResend = async (values: TValues): Promise<void> => {
    const recipient = values[otpVia] || (otpSession.otpTarget as unknown as string);
    if (!recipient) return;

    setIsResending(true);
    try {
      const payload = { [otpVia]: recipient } as Pick<TValues, TOtpVia>;
      const result = await onSend(payload);

      if (!result.success) {
        return;
      }

      setOtpSession((prev) => ({
        otpSessionActive: true,
        otpTarget: recipient,
        otpExpiryTimestamp: result.expiryTimestamp,
        otpModalOpen: true,
        otpSessionVersion: prev.otpSessionVersion + 1,
      }));
      setCurrentTimestamp(Date.now());
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOtp = async (
    otp: string,
    values: TValues
  ): Promise<void> => {
    const isVerified = await onVerify(otp, values);
    if (isVerified) {
      clearOtpSession();
    }
  };

  return {
    otpModalOpen: otpSession.otpModalOpen,
    otpSessionActive: otpSession.otpSessionActive,
    otpTarget: otpSession.otpTarget,
    otpExpiryTimestamp: otpSession.otpExpiryTimestamp,
    otpSessionVersion: otpSession.otpSessionVersion,
    timeLeftMs,
    timeLeftSeconds,
    isResending,
    setOtpModalOpen: (open: boolean) => {
      setOtpSession((prev) => ({
        ...prev,
        otpModalOpen: open,
      }));
    },
    handleSubmit,
    handleResend,
    handleVerifyOtp,
    clearOtpSession,
  };
}
