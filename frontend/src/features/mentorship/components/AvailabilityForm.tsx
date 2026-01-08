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

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 max-w-2xl mx-auto shadow-2xl shadow-blue-500/5">
            <h2 className="text-2xl font-bold text-zinc-100 mb-8">Set Availability</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Time Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">From</label>
                        <input
                            type="time"
                            {...register('startTime', { required: 'Start time is required' })}
                            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
                        />
                        {errors.startTime && <p className="text-red-400 text-xs mt-1">{errors.startTime.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">To</label>
                        <input
                            type="time"
                            {...register('endTime', { required: 'End time is required' })}
                            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
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
                            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
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
                            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-600"
                            placeholder="e.g. 30"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Buffer time (minutes)</label>
                        <input
                            type="number"
                            {...register('bufferMinutes', { required: true, min: 0 })}
                            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-600"
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
                            <div className="w-5 h-5 rounded border border-zinc-600 peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center transition-colors">
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
                            <div className="w-5 h-5 rounded border border-zinc-600 peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center transition-colors">
                                {isRecurring && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                            </div>
                            <span className={`text-zinc-300 group-hover:text-zinc-100 transition-colors ${isRecurring ? 'text-blue-100' : ''}`}>Recurring weekly schedule</span>
                        </label>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-4 rounded-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
