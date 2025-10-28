import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './Dialog';
import { cn } from '../utils/classNames';

interface OTPModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onVerify: (otp: string) => void
  onResend?:()=>void
  title?: string
  description?: string
  length?: number
}

export function OTPModal({
  open,
  onOpenChange,
  onVerify,
  onResend,
  title = 'Enter Verification Code',
  description = 'We sent a verification code to your email',
  length = 6,
}: OTPModalProps) {
  const [otp, setOtp] = React.useState<string[]>(Array(length).fill(''));
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

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, i) => {
      if (i < length) newOtp[i] = char;
    });
    setOtp(newOtp);

    const lastIndex = Math.min(pastedData.length, length) - 1;
    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerify = () => {
    const otpString = otp.join('');
    if (otpString.length === length) {
      onVerify(otpString);
    }
  };

  const handleResend = () => {
    setOtp(Array(length).fill(''));
    inputRefs.current[0]?.focus();

    if(onResend) {
        onResend();
    }
  };

  React.useEffect(() => {
    if (open) {
      setOtp(Array(length).fill(''));
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [open, length]);

  const isComplete = otp.every((digit) => digit !== '');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border/50 bg-background/95 backdrop-blur-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">{title}</DialogTitle>
          <DialogDescription className="text-center">{description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-8 py-6">
          <div className="relative">
            <div className="absolute inset-0 -m-4 rounded-2xl bg-linear-to-br from-primary/20 via-accent/10 to-primary/20 opacity-50 blur-2xl" />
            <div className="absolute inset-0 -m-2 rounded-xl bg-linear-to-br from-primary/30 via-transparent to-primary/30 opacity-30 blur-xl" />

            <div className="relative flex gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {(inputRefs.current[index] = el);}}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={cn(
                    'size-12 rounded-lg border-2 bg-background/50 text-center text-xl font-semibold transition-all duration-200 outline-none backdrop-blur-sm sm:size-14 sm:text-2xl',
                    digit
                      ? 'border-primary shadow-[0_0_20px_rgba(255,255,255,0.1)] shadow-primary/50'
                      : 'border-border/50 hover:border-border',
                    'focus:border-primary focus:shadow-[0_0_25px_rgba(255,255,255,0.15)] focus:shadow-primary/60 focus:ring-2 focus:ring-primary/20',
                  )}
                />
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col gap-3">
            <button
              onClick={handleVerify}
              disabled={!isComplete}
              className="w-full shadow-lg transition-all hover:shadow-xl hover:shadow-primary/20"
            >
              Verify Code
            </button>

            <button
              onClick={handleResend}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Didn't receive the code?{' '}
              <span className="text-primary font-medium underline-offset-4 hover:underline">Resend</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
