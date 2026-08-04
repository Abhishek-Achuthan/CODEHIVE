import React, { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = '',
      label,
      error,
      leftIcon,
      rightIcon,
      fullWidth = true,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    
    const widthClass = fullWidth ? 'w-full' : '';
    const stateClass = error 
      ? 'border-danger focus:ring-danger/50 text-danger-500' 
      : 'border-default focus:border-strong focus:ring-primary/50 text-zinc-100';

    return (
      <div className={`${widthClass} flex flex-col gap-1.5`}>
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-zinc-300 uppercase tracking-wide">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`
              block w-full bg-app rounded-md text-sm transition-colors
              px-3 py-2 
              placeholder:text-zinc-500 
              focus:outline-none focus:ring-1
              disabled:opacity-50 disabled:bg-surface
              ${leftIcon ? 'pl-9' : ''}
              ${rightIcon ? 'pr-9' : ''}
              ${stateClass}
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-zinc-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-danger mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
