import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { cn } from '../utils/classNames';

interface EmptyStateProps {
  title?: string;
  description?: string;
  lottieSrc?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No data available",
  description = "There are no items to display at this time.",
  lottieSrc = "https://lottie.host/80eb21ed-7de2-4c25-8a2a-b7e3e4a2e5eb/pL4jNfGgG3.lottie",
  action,
  className,
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      <div className="w-48 h-48 mb-6">
        <DotLottieReact
          src={lottieSrc}
          loop
          autoplay
        />
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{title}</h3>
      <p className="text-zinc-500 max-w-md mx-auto mb-6">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};
