import React from 'react';

interface PageHeaderProps {
    label?: string;
    title: string;
    description: string;
    children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    label = "Sessions",
    title,
    description,
    children
}) => {
    return (
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between animate-in fade-in slide-in-from-left duration-700">
            <div className="flex gap-6">
                {/* Vertical Accent Line with Glow */}
                <div className="w-1.5 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)] h-20 sm:h-24 self-center" />

                <div className="flex flex-col justify-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400/90 mb-1">
                        {label}
                    </span>
                    <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl bg-linear-to-r from-white via-white to-white/40 bg-clip-text text-transparent italic">
                        {title}
                    </h1>
                    <p className="mt-3 text-sm sm:text-base leading-relaxed text-zinc-500 max-w-xl font-medium">
                        {description}
                    </p>
                </div>
            </div>

            {children && (
                <div className="flex items-center gap-3">
                    {children}
                </div>
            )}
        </div>
    );
};
