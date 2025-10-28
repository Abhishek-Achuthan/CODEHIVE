import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement>

export function PasswordInput(props: Props) {
  const [show, setShow] = React.useState(false);
  return (
    <div className="relative">
      <input
        {...props}
        type={show ? 'text' : 'password'}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
      />
      <button
        type="button"
        aria-label={show ? 'Hide password' : 'Show password'}
        onClick={() => setShow((s) => !s)}
        className="absolute inset-y-0 right-2 my-auto inline-flex h-8 w-8 items-center justify-center rounded-md text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
      >
        {show ? (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.62-1.45 1.59-2.87 2.82-4.06M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.89 11 8-.56 1.32-1.4 2.63-2.47 3.76M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path d="m1 1 22 22" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}
