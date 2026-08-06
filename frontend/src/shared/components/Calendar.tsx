import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface DaySlotInfo {
    hasSlots: boolean;
    hasOneToOne: boolean;
    hasGroup: boolean;
}

interface CalendarProps {
    selectedDate: Date | null;
    onSelectDate: (date: Date | null) => void;
    showRecurringOption?: boolean;
    getDateSlotInfo?: (date: Date) => DaySlotInfo | null;
    activeFilter?: "ALL" | "ONE_TO_ONE" | "PRIVATE_SESSION";
    onMonthChange?: (newMonth: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
    selectedDate,
    onSelectDate,
    showRecurringOption = false,
    getDateSlotInfo,
    activeFilter = "ALL",
    onMonthChange,
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const today = new Date();

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    // 3 Month Boundary Constraints: Current Month up to Current Month + 2
    const isPrevDisabled =
        currentDate.getFullYear() < today.getFullYear() ||
        (currentDate.getFullYear() === today.getFullYear() && currentDate.getMonth() <= today.getMonth());

    const maxMonthDate = new Date(today.getFullYear(), today.getMonth() + 2, 1);
    const isNextDisabled =
        currentDate.getFullYear() > maxMonthDate.getFullYear() ||
        (currentDate.getFullYear() === maxMonthDate.getFullYear() && currentDate.getMonth() >= maxMonthDate.getMonth());

    const handlePrevMonth = () => {
        if (isPrevDisabled) return;
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        setCurrentDate(newDate);
        onMonthChange?.(newDate);
    };

    const handleNextMonth = () => {
        if (isNextDisabled) return;
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        setCurrentDate(newDate);
        onMonthChange?.(newDate);
    };

    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    };

    const renderDays = () => {
        const days = [];
        const emptyDays = firstDay;

        for (let i = 0; i < emptyDays; i++) {
            days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
            const isToday = isSameDay(date, today);
            const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const isPast = date < todayStart;

            const slotInfo = getDateSlotInfo ? getDateSlotInfo(date) : null;
            const hasMatchingSlots = slotInfo
                ? activeFilter === "ONE_TO_ONE"
                    ? slotInfo.hasOneToOne
                    : activeFilter === "PRIVATE_SESSION"
                    ? slotInfo.hasGroup
                    : slotInfo.hasSlots
                : false;

            days.push(
                <button
                    key={day}
                    onClick={() => onSelectDate(date)}
                    disabled={isPast}
                    className={`
                        relative flex h-10 w-10 items-center justify-center rounded-full text-sm transition-all
                        ${isSelected ? 'bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-500/30' : 'text-zinc-300 hover:bg-zinc-800'}
                        ${isToday && !isSelected ? 'border border-indigo-500/50 text-indigo-400' : ''}
                        ${isPast ? 'text-zinc-600 cursor-not-allowed hover:bg-transparent' : ''}
                        ${!isPast && hasMatchingSlots && !isSelected ? 'ring-1 ring-indigo-500/40 font-semibold text-zinc-100 bg-zinc-800/50' : ''}
                    `}
                >
                    {day}
                    {!isPast && hasMatchingSlots && (
                        <span
                            className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                                activeFilter === "PRIVATE_SESSION"
                                    ? "bg-purple-400 shadow-xs shadow-purple-500"
                                    : activeFilter === "ONE_TO_ONE"
                                    ? "bg-blue-400 shadow-xs shadow-blue-500"
                                    : "bg-indigo-400 shadow-xs shadow-indigo-500"
                            }`}
                        />
                    )}
                </button>
            );
        }
        return days;
    };

    return (
        <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-[#121214] p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white tracking-tight">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={handlePrevMonth}
                        disabled={isPrevDisabled}
                        className="rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-zinc-400"
                        title={isPrevDisabled ? "Cannot navigate to past months" : "Previous month"}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        onClick={handleNextMonth}
                        disabled={isNextDisabled}
                        className="rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-zinc-400"
                        title={isNextDisabled ? "Limit reached (Max 3 months ahead)" : "Next month"}
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="mb-2 grid grid-cols-7 text-center">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-xs font-medium text-zinc-500 py-2 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-y-2 place-items-center">
                {renderDays()}
            </div>

            {showRecurringOption && (
                <div className="mt-6 flex flex-col gap-3 border-t border-zinc-800 pt-6">
                    <button
                        onClick={() => onSelectDate(null)}
                        className={`
                        w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors
                        ${selectedDate === null
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm'
                                : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                            }
                    `}
                    >
                        Set Recurring Schedule
                    </button>
                </div>
            )}
        </div>
    );
};
