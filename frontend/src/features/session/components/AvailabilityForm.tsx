import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Plus, Clock, Info } from 'lucide-react';
import type { AvailabilityFormData } from '../types';

interface AvailabilityFormProps {
    onSubmit: (data: AvailabilityFormData) => Promise<void>;
    isLoading?: boolean;
    isRecurring: boolean;
    selectedDate?: Date | null;
}

export const AvailabilityForm: React.FC<AvailabilityFormProps> = ({ onSubmit, isLoading, isRecurring, selectedDate }) => {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<AvailabilityFormData>({
        defaultValues: {
            slotDurationMinutes: 30,
            bufferMinutes: 10,
            isRecurring: isRecurring,
            slotPrice: 0,
            selectedDays: [],
            durationType: 'forever',
            occurrenceCount: 12
        }
    });

    useEffect(() => {
        setValue('isRecurring', isRecurring);
        if (selectedDate && !isRecurring) {
            const y = selectedDate.getFullYear();
            const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const d = String(selectedDate.getDate()).padStart(2, '0');
            setValue('date', `${y}-${m}-${d}`);
        }

        // Reset recurring-specific fields when switching modes
        if (!isRecurring) {
            setValue('selectedDays', []);
            setValue('durationType', 'forever');
        }
    }, [isRecurring, selectedDate, setValue]);


    const startTime = watch('startTime');
    const endTime = watch('endTime');
    const slotDurationMinutes = watch('slotDurationMinutes');
    const bufferMinutes = watch('bufferMinutes');
    const selectedDays = watch('selectedDays');
    const durationType = watch('durationType');

    const DAYS = [
        { value: 'MO', label: 'Mon' },
        { value: 'TU', label: 'Tue' },
        { value: 'WE', label: 'Wed' },
        { value: 'TH', label: 'Thu' },
        { value: 'FR', label: 'Fri' },
        { value: 'SA', label: 'Sat' },
        { value: 'SU', label: 'Sun' }
    ];

    const toggleDay = (dayValue: string) => {
        const current = selectedDays || [];
        if (current.includes(dayValue)) {
            setValue('selectedDays', current.filter(d => d !== dayValue));
        } else {
            setValue('selectedDays', [...current, dayValue]);
        }
    };

    const slotsPreview = React.useMemo(() => {
        const parse = (t?: string) => {
            if (!t) return null;
            const [h, m] = t.split(':').map(Number);
            if (Number.isNaN(h) || Number.isNaN(m)) return null;
            return h * 60 + m;
        };

        const format = (mins: number) => {
            const h = Math.floor(mins / 60);
            const m = mins % 60;
            const ampm = h >= 12 ? 'PM' : 'AM';
            const displayH = h % 12 || 12;
            return `${displayH}:${String(m).padStart(2, '0')} ${ampm}`;
        };

        const start = parse(startTime);
        const end = parse(endTime);
        const duration = Number(slotDurationMinutes);
        const buffer = Number(bufferMinutes);

        if (start === null || end === null) return [];
        if (!Number.isFinite(duration) || duration <= 0) return [];
        if (!Number.isFinite(buffer) || buffer < 0) return [];
        if (end <= start) return [];

        const out: Array<{ startTime: string; endTime: string }> = [];
        let cursor = start;

        // Ensure loop terminates
        while (cursor + duration <= end) {
            out.push({ startTime: format(cursor), endTime: format(cursor + duration) });
            cursor = cursor + duration + buffer;
            // Safety break to prevent infinite loops if logic fails
            if (out.length > 50) break;
        }

        return out;
    }, [startTime, endTime, slotDurationMinutes, bufferMinutes]);

    return (
        <div className="rounded-xl border border-gray-800 bg-black p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                {isRecurring ? (
                    <>
                        <Clock className="h-5 w-5 text-indigo-400" />
                        Weekly Recurring Schedule
                    </>
                ) : (
                    <>
                        <Plus className="h-5 w-5 text-indigo-400" />
                        Add Availability for {selectedDate?.toLocaleDateString()}
                    </>
                )}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Time Selection */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Start Time</label>
                        <input
                            type="time"
                            {...register('startTime', { required: 'Start time is required' })}
                            className="w-full rounded-lg border border-gray-800 bg-zinc-900/50 px-4 py-2.5 text-sm text-white focus:border-indigo-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
                        />
                        {errors.startTime && <p className="text-red-400 text-xs mt-1">{errors.startTime.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">End Time</label>
                        <input
                            type="time"
                            {...register('endTime', { required: 'End time is required' })}
                            className="w-full rounded-lg border border-gray-800 bg-zinc-900/50 px-4 py-2.5 text-sm text-white focus:border-indigo-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
                        />
                        {errors.endTime && <p className="text-red-400 text-xs mt-1">{errors.endTime.message}</p>}
                    </div>
                </div>

                {/* Duration & Buffer */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Slot Duration <span className="text-gray-600">(min)</span></label>
                        <input
                            type="number"
                            {...register('slotDurationMinutes', { required: true, min: 15 })}
                            className="w-full rounded-lg border border-gray-800 bg-zinc-900/50 px-4 py-2.5 text-sm text-white focus:border-indigo-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Buffer <span className="text-gray-600">(min)</span></label>
                        <input
                            type="number"
                            {...register('bufferMinutes', { required: true, min: 0 })}
                            className="w-full rounded-lg border border-gray-800 bg-zinc-900/50 px-4 py-2.5 text-sm text-white focus:border-indigo-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Price per Session</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                        <input
                            type="number"
                            {...register('slotPrice', { required: 'Price is required', min: { value: 0, message: 'Price must be positive' } })}
                            className="w-full rounded-lg border border-gray-800 bg-zinc-900/50 pl-8 pr-4 py-2.5 text-sm text-white focus:border-indigo-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
                            placeholder="500"
                        />
                    </div>
                </div>

                {/* Recurring-specific controls */}
                {isRecurring && (
                    <>
                        {/* Day Selection */}
                        <div className="space-y-3">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Repeat on</label>
                            <div className="grid grid-cols-7 gap-2">
                                {DAYS.map(day => (
                                    <button
                                        key={day.value}
                                        type="button"
                                        onClick={() => toggleDay(day.value)}
                                        className={`py-2 px-1 rounded-lg text-xs font-semibold transition-all border ${selectedDays?.includes(day.value)
                                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                            : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:border-zinc-600'
                                            }`}
                                    >
                                        {day.label}
                                    </button>
                                ))}
                            </div>
                            {selectedDays?.length === 0 && (
                                <p className="text-xs text-yellow-500">Select at least one day for recurring schedule</p>
                            )}
                        </div>

                        {/* Duration Options */}
                        <div className="space-y-3">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Duration</label>

                            <div className="space-y-3">
                                {/* Forever */}
                                <label className="flex items-center gap-3 p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 cursor-pointer hover:bg-zinc-800/50 transition-colors">
                                    <input
                                        type="radio"
                                        {...register('durationType')}
                                        value="forever"
                                        className="text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-white">Repeat indefinitely</span>
                                </label>

                                {/* Until Date */}
                                <label className="flex items-start gap-3 p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 cursor-pointer hover:bg-zinc-800/50 transition-colors">
                                    <input
                                        type="radio"
                                        {...register('durationType')}
                                        value="until"
                                        className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <div className="flex-1 space-y-2">
                                        <span className="text-sm text-white block">End on specific date</span>
                                        {durationType === 'until' && (
                                            <input
                                                type="date"
                                                {...register('endDate')}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full rounded-lg border border-gray-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                            />
                                        )}
                                    </div>
                                </label>

                                {/* Count */}
                                <label className="flex items-start gap-3 p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 cursor-pointer hover:bg-zinc-800/50 transition-colors">
                                    <input
                                        type="radio"
                                        {...register('durationType')}
                                        value="count"
                                        className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <div className="flex-1 space-y-2">
                                        <span className="text-sm text-white block">Repeat a specific number of times</span>
                                        {durationType === 'count' && (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    {...register('occurrenceCount', { min: 1, max: 52 })}
                                                    className="w-24 rounded-lg border border-gray-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                />
                                                <span className="text-xs text-gray-400">weeks</span>
                                            </div>
                                        )}
                                    </div>
                                </label>
                            </div>
                        </div>
                    </>
                )}

                {/* Hidden Date Input for Form Submission */}
                {!isRecurring && (
                    <input type="hidden" {...register('date')} />
                )}

                <div className="rounded-lg bg-indigo-500/5 border border-indigo-500/10 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Info className="h-4 w-4 text-indigo-400" />
                        <span className="text-xs font-medium text-indigo-300">Preview Slots</span>
                    </div>
                    {slotsPreview.length === 0 ? (
                        <div className="text-xs text-gray-500 italic">
                            Set start and end times to see generated slots.
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {slotsPreview.slice(0, 8).map((slot, idx) => (
                                <span
                                    key={`${slot.startTime}-${idx}`}
                                    className="inline-flex items-center rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2 py-1 text-xs font-medium text-indigo-300"
                                >
                                    {slot.startTime} - {slot.endTime}
                                </span>
                            ))}
                            {slotsPreview.length > 8 && (
                                <span className="text-xs text-gray-500 flex items-center self-center">
                                    +{slotsPreview.length - 8} more
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-lg bg-linear-to-r from-indigo-600 to-violet-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Availability'}
                </button>
            </form>
        </div>
    );
};
