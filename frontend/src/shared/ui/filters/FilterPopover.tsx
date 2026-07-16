import { ReactNode, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

interface FilterPopoverProps {
    trigger: (isOpen: boolean) => ReactNode;
    children: (close: () => void) => ReactNode;
    className?: string;
}

export function FilterPopover({ trigger, children, className = "" }: FilterPopoverProps) {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(popoverRef, () => setIsOpen(false));

    return (
        <div className="relative inline-block text-left" ref={popoverRef}>
            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
                {trigger(isOpen)}
            </div>
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute left-0 top-full mt-2 z-50 min-w-[200px] rounded-xl border border-white/10 bg-zinc-900 p-2 shadow-xl shadow-black/50 ${className}`}
                    >
                        {children(() => setIsOpen(false))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
