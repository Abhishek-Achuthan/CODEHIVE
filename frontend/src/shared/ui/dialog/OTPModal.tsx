import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../dialog/Dialog";
import { cn } from "../../utils/classNames";

interface OTPModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerify: (otp: string) => void;
  onResend?: () => Promise<void>;
  title?: string;
  description?: string;
  length?: number;
  timeLeftSeconds: number;
  sessionVersion: number;
  isResending?: boolean;
}

export function OTPModal({
  open,
  onOpenChange,
  onVerify,
  onResend,
  title = "Enter Verification Code",
  description = "We sent a verification code to your email",
  length = 6,
  timeLeftSeconds,
  sessionVersion,
  isResending = false,
}: OTPModalProps) {
  const [otp, setOtp] = React.useState<string[]>(Array(length).fill(""));
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      if (i < length) newOtp[i] = char;
    });
    setOtp(newOtp);

    const lastIndex = Math.min(pastedData.length, length) - 1;
    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerify = () => {
    const otpString = otp.join("");
    if (otpString.length === length) {
      onVerify(otpString);
    }
  };

  const handleResend = async () => {
    if (!onResend) return;
    try {
      await onResend();
    } catch {
      // Errors are surfaced by the resend handler's toast flow.
    }
  };

  React.useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [open]);

  React.useEffect(() => {
    if (sessionVersion > 0) {
      setOtp(Array(length).fill(""));
      if (open) {
        window.setTimeout(() => inputRefs.current[0]?.focus(), 100);
      }
    }
  }, [length, open, sessionVersion]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isComplete = otp.every((digit) => digit !== "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-zinc-800 bg-[#121214]/95 backdrop-blur-xl sm:max-w-md shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold tracking-tight text-white">{title}</DialogTitle>
          <DialogDescription className="text-center text-sm text-zinc-400 mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-8 py-6">
          <div className="relative">
            <div className="absolute inset-0 -m-4 rounded-2xl bg-linear-to-br from-indigo-500/10 via-purple-500/5 to-indigo-500/10 opacity-50 blur-2xl pointer-events-none" />

            <div className="relative flex gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={cn(
                    "size-12 rounded-lg border-2 bg-[#09090b] text-center text-xl font-semibold text-white transition-all duration-200 outline-none sm:size-14 sm:text-2xl",
                    digit
                      ? "border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.1)] shadow-indigo-500/30"
                      : "border-zinc-800 hover:border-zinc-700",
                    "focus:border-indigo-500 focus:shadow-[0_0_25px_rgba(99,102,241,0.15)] focus:shadow-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20"
                  )}
                />
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col gap-4 mt-2">
            <button
              onClick={handleVerify}
              disabled={!isComplete}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-500 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify Code
            </button>

            <div className="flex flex-col items-center justify-center pt-2">
              {timeLeftSeconds > 0 ? (
                <p className="text-sm text-zinc-500 font-medium">
                  Resend code in{" "}
                  <span className="text-indigo-400">{formatTime(timeLeftSeconds)}</span>
                </p>
              ) : (
                <button
                  onClick={() => void handleResend()}
                  disabled={isResending}
                  className="text-sm font-medium text-zinc-400 hover:text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isResending ? "Resending..." : "Didn't receive the code?"}{" "}
                  <span className="text-indigo-400 hover:text-indigo-300 hover:underline underline-offset-4">
                    {isResending ? "Please wait" : "Resend"}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
