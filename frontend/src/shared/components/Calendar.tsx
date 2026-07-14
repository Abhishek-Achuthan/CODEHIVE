import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
    selectedDate: Date | null;
    onSelectDate: (date: Date | null) => void;
    showRecurringOption?: boolean;
}

export const Calendar: React.FC<CalendarProps> = ({ selectedDate, onSelectDate, showRecurringOption = false }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

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
    const today = new Date();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    };



    const renderDays = () => {
        const days = [];
        const emptyDays = firstDay;

        // Empty slots for previous month
        for (let i = 0; i < emptyDays; i++) {
            days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
        }

        // Days of current month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
            const isToday = isSameDay(date, today);
            const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const isPast = date < todayStart;

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
                    `}
                >
                    {day}
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
                    <button onClick={handlePrevMonth} className="rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button onClick={handleNextMonth} className="rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
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
