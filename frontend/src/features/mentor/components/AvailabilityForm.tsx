import React, { useEffect } from 'react';
import { useForm, type SubmitHandler, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Clock, Info } from 'lucide-react';
import type { AvailabilityFormData } from '../types';
import { availabilityFormSchema, type AvailabilityFormSchema } from '../validations/availabilityValidation';
import { Calendar } from '../../../shared/components/Calendar';

interface AvailabilityFormProps {
    onSubmit: (data: AvailabilityFormData) => Promise<void>;
    isLoading?: boolean;
    isRecurring: boolean;
    selectedDate: Date | null;
    onDateSelect: (date: Date | null) => void;
}

export const AvailabilityForm: React.FC<AvailabilityFormProps> = ({ onSubmit, isLoading, isRecurring, selectedDate, onDateSelect }) => {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<AvailabilityFormSchema>({
        resolver: zodResolver(availabilityFormSchema) as Resolver<AvailabilityFormSchema>,
        defaultValues: {
            startTime: '',
            endTime: '',
            slotDurationMinutes: 30,
            bufferMinutes: 10,
            isRecurring: isRecurring,
            slotPrice: 0,
            selectedDays: [],
            durationType: 'forever',
            occurrenceCount: 12,
            date: '',
            endDate: '',
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

    const handleFormSubmit: SubmitHandler<AvailabilityFormSchema> = async (data) => {
        await onSubmit(data as AvailabilityFormData);
    };

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

        while (cursor + duration <= end) {
            out.push({ startTime: format(cursor), endTime: format(cursor + duration) });
            cursor = cursor + duration + buffer;
            if (out.length > 50) break;
        }

        return out;
    }, [startTime, endTime, slotDurationMinutes, bufferMinutes]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
            {/* LEFT COLUMN: Controls */}
            <div className="space-y-8 bg-zinc-900/40 p-6 sm:p-8 rounded-3xl border border-white/5 backdrop-blur-xl">
                
                {/* Top: Segmented Control */}
                <div className="inline-flex rounded-xl bg-black/50 p-1 border border-white/5 w-full">
                    <button
                        type="button"
                        onClick={() => onDateSelect(null)}
                        className={`flex-1 rounded-lg px-4 py-2.5 text-xs font-bold transition-all ${
                            isRecurring 
                            ? 'bg-white text-black shadow-lg shadow-white/10' 
                            : 'text-zinc-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        Weekly Recurring
                    </button>
                    <button
                        type="button"
                        onClick={() => onDateSelect(selectedDate || new Date())}
                        className={`flex-1 rounded-lg px-4 py-2.5 text-xs font-bold transition-all ${
                            !isRecurring 
                            ? 'bg-white text-black shadow-lg shadow-white/10' 
                            : 'text-zinc-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        Specific Date
                    </button>
                </div>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
                    {/* Section: Time Range & Duration */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                            <Clock className="h-4 w-4 text-indigo-400" />
                            <h3 className="text-base font-bold text-white">Time Range & Slots</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Start Time</label>
                                <input
                                    type="time"
                                    {...register('startTime')}
                                    className="w-full rounded-xl border border-white/5 bg-black/50 px-4 py-3 text-sm text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-all cursor-pointer"
                                />
                                {errors.startTime && <p className="text-red-400 text-xs mt-1">{errors.startTime.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">End Time</label>
                                <input
                                    type="time"
                                    {...register('endTime')}
                                    className="w-full rounded-xl border border-white/5 bg-black/50 px-4 py-3 text-sm text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-all cursor-pointer"
                                />
                                {errors.endTime && <p className="text-red-400 text-xs mt-1">{errors.endTime.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex justify-between">
                                    Slot Duration 
                                    <span className="text-zinc-600">(min)</span>
                                </label>
                                <input
                                    type="number"
                                    {...register('slotDurationMinutes')}
                                    className="w-full rounded-xl border border-white/5 bg-black/50 px-4 py-3 text-sm text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-all"
                                />
                                {errors.slotDurationMinutes && <p className="text-red-400 text-xs mt-1">{errors.slotDurationMinutes.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex justify-between">
                                    Buffer <span className="text-zinc-600">(min)</span>
                                </label>
                                <input
                                    type="number"
                                    {...register('bufferMinutes')}
                                    className="w-full rounded-xl border border-white/5 bg-black/50 px-4 py-3 text-sm text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-all"
                                />
                                {errors.bufferMinutes && <p className="text-red-400 text-xs mt-1">{errors.bufferMinutes.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Section: Pricing */}
                    <div className="space-y-6">
                        <h3 className="text-base font-bold text-white border-b border-white/5 pb-3">Session Pricing</h3>
                        <div className="space-y-2 max-w-xs">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Price per Session</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">₹</span>
                                <input
                                    type="number"
                                    {...register('slotPrice')}
                                    className="w-full rounded-xl border border-white/5 bg-black/50 pl-10 pr-4 py-3 text-lg font-black text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-all"
                                    placeholder="500"
                                />
                                {errors.slotPrice && <p className="text-red-400 text-xs mt-1">{errors.slotPrice.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Section: Recurring Rules */}
                    {isRecurring && (
                        <div className="space-y-6">
                            <h3 className="text-base font-bold text-white border-b border-white/5 pb-3">Repeat Rules</h3>
                            
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Repeat On Days</label>
                                <div className="flex flex-wrap gap-2">
                                    {DAYS.map(day => {
                                        const isActive = selectedDays?.includes(day.value);
                                        return (
                                            <button
                                                key={day.value}
                                                type="button"
                                                onClick={() => toggleDay(day.value)}
                                                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all border ${
                                                    isActive
                                                    ? 'bg-indigo-500 text-white border-indigo-400/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                                                    : 'bg-black/50 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                                                }`}
                                            >
                                                {day.label}
                                            </button>
                                        );
                                    })}
                                </div>
                                {errors.selectedDays && (
                                    <p className="text-red-400 text-xs mt-1">{errors.selectedDays.message}</p>
                                )}
                                {!errors.selectedDays && selectedDays?.length === 0 && (
                                    <p className="text-xs text-yellow-500">Select at least one day for a recurring schedule</p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Duration Range</label>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-black/50 cursor-pointer hover:bg-white/[0.02] transition-colors">
                                        <input
                                            type="radio"
                                            {...register('durationType')}
                                            value="forever"
                                            className="text-indigo-600 focus:ring-indigo-500 bg-zinc-900 border-zinc-700"
                                        />
                                        <span className="text-sm font-semibold text-white">Repeat indefinitely</span>
                                    </label>

                                    <label className="flex items-start gap-3 p-4 rounded-xl border border-white/5 bg-black/50 cursor-pointer hover:bg-white/[0.02] transition-colors">
                                        <input
                                            type="radio"
                                            {...register('durationType')}
                                            value="until"
                                            className="mt-0.5 text-indigo-600 focus:ring-indigo-500 bg-zinc-900 border-zinc-700"
                                        />
                                        <div className="flex-1 space-y-2">
                                            <span className="text-sm font-semibold text-white block">End on specific date</span>
                                            {durationType === 'until' && (
                                                <div className="mt-2">
                                                    <input
                                                        type="date"
                                                        {...register('endDate')}
                                                        min={new Date().toISOString().split('T')[0]}
                                                        className={`max-w-xs w-full rounded-xl border ${errors.endDate ? 'border-red-500' : 'border-white/5'} bg-zinc-950 px-4 py-2.5 text-sm text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white`}
                                                    />
                                                    {errors.endDate && <p className="text-red-400 text-xs mt-1">{errors.endDate.message}</p>}
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {!isRecurring && (
                        <input type="hidden" {...register('date')} />
                    )}

                    {/* Action Area */}
                    <div className="pt-6 border-t border-white/5">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-xl bg-white py-4 text-sm font-black tracking-widest uppercase text-black shadow-xl shadow-white/10 transition-all hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-black" /> : 'Save Availability'}
                        </button>
                    </div>
                </form>
            </div>

            {/* RIGHT COLUMN: Live Previews */}
            <div className="space-y-6 sticky top-24">
                {/* Calendar Panel */}
                <div className="rounded-3xl border border-white/5 bg-zinc-900/40 p-5 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Select Date</span>
                        {selectedDate && !isRecurring && (
                            <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md">
                                {selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                        )}
                    </div>
                    <Calendar 
                        selectedDate={!isRecurring ? (selectedDate || null) : null}
                        onSelectDate={(date) => date && onDateSelect(date)}
                        showRecurringOption={false}
                    />
                </div>
                {/* Slots Preview Panel */}
                <div className="rounded-3xl bg-zinc-900/40 border border-white/5 p-6 backdrop-blur-xl">
                    <div className="flex items-center gap-2 mb-4 px-1">
                        <Info className="h-4 w-4 text-zinc-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Live Slots Preview</span>
                    </div>
                    {slotsPreview.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center bg-black/20">
                            <p className="text-xs font-semibold text-zinc-500">
                                Configure start and end times to see generated slots.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {slotsPreview.map((slot, idx) => (
                                <div
                                    key={`${slot.startTime}-${idx}`}
                                    className="flex items-center justify-between rounded-xl border border-white/5 bg-black/50 px-4 py-3 text-sm font-semibold text-zinc-300"
                                >
                                    <span>{slot.startTime}</span>
                                    <span className="text-zinc-600">-</span>
                                    <span>{slot.endTime}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
