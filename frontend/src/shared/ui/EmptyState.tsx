import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  animationSrc: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  animationClassName?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  animationSrc,
  title,
  description,
  actionLabel,
  onAction,
  animationClassName = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="flex flex-col items-center justify-center py-24 text-center w-full"
    >

      <div className={`w-[400px] h-[400px] md:w-[300px] md:h-[300px] mb-8 flex items-center justify-center filter hue-rotate-[320deg] saturate-150 opacity-90 ${animationClassName}`}>
        <DotLottieReact
          src={animationSrc}
          loop
          autoplay
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      
      <h3 className="mb-3 text-2xl font-bold text-white tracking-tight">
        {title}
      </h3>
      
      <p className="mb-8 text-zinc-400 max-w-sm mx-auto leading-relaxed text-sm md:text-base">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="relative group flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-indigo-600/90 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[0_0_20px_rgba(79,70,229,0.15)] hover:bg-indigo-500 hover:shadow-[0_0_25px_rgba(79,70,229,0.3)] active:scale-[0.98]"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};
