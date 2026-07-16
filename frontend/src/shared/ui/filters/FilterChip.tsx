import { X, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

interface FilterChipProps {
    label: string;
    value?: string;
    onRemove?: () => void;
    isActive?: boolean;
    hasDropdown?: boolean;
}

export function FilterChip({ label, value, onRemove, isActive, hasDropdown }: FilterChipProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors select-none
                ${isActive
                    ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20"
                    : "border-white/10 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                }
            `}
        >
            <span>{label}</span>
            {value && (
                <>
                    <span className="text-zinc-500">:</span>
                    <span className={isActive ? "text-indigo-200" : "text-zinc-100"}>{value}</span>
                </>
            )}
            
            {hasDropdown && !onRemove && (
                <ChevronDown className={`ml-0.5 h-3 w-3 ${isActive ? "text-indigo-400" : "text-zinc-500"}`} />
            )}

            {onRemove && (
                <div
                    role="button"
                    tabIndex={0}
                    className="ml-1 -mr-1 rounded-full p-0.5 hover:bg-white/10 hover:text-white transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                >
                    <X className="h-3 w-3" />
                </div>
            )}
        </motion.div>
    );
}
