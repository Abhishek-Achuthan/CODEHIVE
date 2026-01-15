import React from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

interface AvailabilityFormData {
    startTime: string; 
    endTime: string; 
    slotDurationMinutes: number;
    bufferMinutes: number;
    isRecurring: boolean;
    date?: string;
}

interface AvailabilityFormProps {
    onSubmit: (data: AvailabilityFormData) => Promise<void>;
    isLoading?: boolean;
}

export const AvailabilityForm: React.FC<AvailabilityFormProps> = ({ onSubmit, isLoading }) => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<AvailabilityFormData>({
        defaultValues: {
            slotDurationMinutes: 30,
            bufferMinutes: 0,
            isRecurring: false
        }
    });

    const isRecurring = watch('isRecurring');
    const startTime = watch('startTime');
    const endTime = watch('endTime');
    const slotDurationMinutes = watch('slotDurationMinutes');
    const bufferMinutes = watch('bufferMinutes');

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
            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
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
        }

        return out;
    }, [startTime, endTime, slotDurationMinutes, bufferMinutes]);

    return (
        <div className="rounded-xl border border-gray-800 bg-black px-6 py-6">
            <h2 className="text-xl font-semibold text-white mb-6">Set Availability</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Time Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">From</label>
                        <input
                            type="time"
                            {...register('startTime', { required: 'Start time is required' })}
                            className="w-full rounded-lg border border-gray-700 bg-black px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all cursor-pointer"
                        />
                        {errors.startTime && <p className="text-red-400 text-xs mt-1">{errors.startTime.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">To</label>
                        <input
                            type="time"
                            {...register('endTime', { required: 'End time is required' })}
                            className="w-full rounded-lg border border-gray-700 bg-black px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all cursor-pointer"
                        />
                        {errors.endTime && <p className="text-red-400 text-xs mt-1">{errors.endTime.message}</p>}
                    </div>
                </div>

                {!isRecurring && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Date</label>
                        <input
                            type="date"
                            {...register('date', { required: !isRecurring ? 'Date is required' : false })}
                            className="w-full rounded-lg border border-gray-700 bg-black px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all cursor-pointer"
                            min={new Date().toISOString().split('T')[0]}
                        />
                        {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date.message}</p>}
                    </div>
                )}

                {/* Duration & Buffer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Duration (minutes)</label>
                        <input
                            type="number"
                            {...register('slotDurationMinutes', { required: true, min: 15 })}
                            className="w-full rounded-lg border border-gray-700 bg-black px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all placeholder:text-gray-600"
                            placeholder="e.g. 30"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Buffer time (minutes)</label>
                        <input
                            type="number"
                            {...register('bufferMinutes', { required: true, min: 0 })}
                            className="w-full rounded-lg border border-gray-700 bg-black px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all placeholder:text-gray-600"
                            placeholder="e.g. 5"
                        />
                    </div>
                </div>

                {/* Scheduling Type */}
                <div className="space-y-4">
                    <label className="text-sm font-medium text-zinc-400 block">Scheduling Type</label>
                    <div className="flex flex-col space-y-3">
                        <label className="flex items-center space-x-3 cursor-pointer group">
                            <input
                                type="radio"
                                value="false" 
                                {...register('isRecurring', {
                                    setValueAs: (v) => v === 'true' 
                                })}
                                className="hidden peer"
                                defaultChecked
                            />
                            <div className="w-5 h-5 rounded border border-zinc-600 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 flex items-center justify-center transition-colors">
                                {!isRecurring && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                            </div>
                            <span className={`text-zinc-300 group-hover:text-zinc-100 transition-colors ${!isRecurring ? 'text-blue-100' : ''}`}>One-time availability</span>
                        </label>

                        <label className="flex items-center space-x-3 cursor-pointer group">
                            <input
                                type="radio"
                                value="true" 
                                {...register('isRecurring', {
                                    setValueAs: (v) => v === 'true'
                                })}
                                className="hidden peer"
                            />
                            <div className="w-5 h-5 rounded border border-zinc-600 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 flex items-center justify-center transition-colors">
                                {isRecurring && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                            </div>
                            <span className={`text-zinc-300 group-hover:text-zinc-100 transition-colors ${isRecurring ? 'text-blue-100' : ''}`}>Recurring weekly schedule</span>
                        </label>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="text-sm font-medium text-zinc-400">Hourly Slots</div>
                    {slotsPreview.length === 0 ? (
                        <div className="text-xs text-gray-500">
                            Add start time, end time, duration and buffer to preview slots.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            {slotsPreview.slice(0, 6).map((slot, idx) => (
                                <div
                                    key={`${slot.startTime}_${slot.endTime}_${idx}`}
                                    className="rounded-lg border border-gray-700 bg-black px-3 py-2 text-xs text-gray-200"
                                >
                                    {slot.startTime} - {slot.endTime}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                        'Save Availability'
                    )}
                </button>

            </form>
        </div>
    );
};
