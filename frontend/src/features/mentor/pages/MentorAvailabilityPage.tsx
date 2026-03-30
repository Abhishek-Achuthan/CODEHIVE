import React, { useState, useCallback } from 'react';
import { AvailabilityForm } from '../components/AvailabilityForm';
import type { AvailabilityFormData } from '../types';
import { MentorshipService } from '../../../services/mentorService';
import toast from 'react-hot-toast';
import { BaseError } from '../../../shared/errors/BaseError';
import { CalendarPlus, ListTodo } from 'lucide-react';
import { ManageRulesSection } from '../components/ManageRulesSection';
import { PageHeader } from '../../../shared/ui/PageHeader';

type TabType = 'create' | 'manage';

const MentorAvailabilityPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('create');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [rulesKey, setRulesKey] = useState(0);

    const handleRulesRefresh = useCallback(() => {
        setRulesKey(prev => prev + 1);
    }, []);

    const handleSubmit = async (data: AvailabilityFormData) => {
        setIsLoading(true);
        try {
            let rrule = '';
            const isRecurring = selectedDate === null;

            if (isRecurring) {
                rrule = 'FREQ=WEEKLY';
                if (data.selectedDays && data.selectedDays.length > 0) {
                    rrule += `;BYDAY=${data.selectedDays.join(',')}`;
                }
                if (data.durationType === 'until' && data.endDate) {
                    const dt = data.endDate.replaceAll('-', '');
                    rrule += `;UNTIL=${dt}`;
                } else if (data.durationType === 'count' && data.occurrenceCount) {
                    rrule += `;COUNT=${data.occurrenceCount}`;
                }
            } else {
                if (!data.date) {
                    throw new Error('Date is required for one-time availability');
                }
                const dt = data.date.replaceAll('-', '');
                rrule = `DTSTART:${dt}`;
            }

            const payload = {
                rrule,
                startTime: data.startTime,
                endTime: data.endTime,
                slotDurationMinutes: Number(data.slotDurationMinutes),
                bufferMinutes: Number(data.bufferMinutes),
                slotPrice: data.slotPrice
            };

            await MentorshipService.setAvailability(payload);
            toast.success(isRecurring ? 'Recurring schedule created!' : 'Availability added!');
            handleRulesRefresh();
            setActiveTab('manage');

        } catch (error) {
            if (error instanceof BaseError)
                toast.error(error.message || 'Failed to set availability');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col">
            <PageHeader
                title="Availability"
                description="Set up your schedule so students can book mentorship sessions with you. Create recurring schedules or add specific dates."
            />

            {/* Tab Navigation */}
            <div className="mb-10">
                <div className="inline-flex rounded-2xl bg-white/[0.03] border border-white/5 p-1.5 backdrop-blur-xl shadow-2xl relative">
                    <div className="absolute inset-0 bg-indigo-500/5 blur-2xl rounded-full -z-10" />
                    <button
                        onClick={() => setActiveTab('create')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-500 ${activeTab === 'create'
                                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                                : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
                            }`}
                    >
                        <CalendarPlus className="h-4 w-4" />
                        Create Slots
                    </button>
                    <button
                        onClick={() => setActiveTab('manage')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-500 ${activeTab === 'manage'
                                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                                : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
                            }`}
                    >
                        <ListTodo className="h-4 w-4" />
                        Active Rules
                    </button>
                </div>
            </div>

            {/* Create Tab Content */}
            {activeTab === 'create' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 pb-20">
                    <AvailabilityForm
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                        isRecurring={selectedDate === null}
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                    />
                </div>
            )}

            {/* Manage Tab Content */}
            {activeTab === 'manage' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex items-center justify-between bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800">
                        <div>
                            <h2 className="text-lg font-semibold text-white mb-1">Active Rulesets</h2>
                            <p className="text-sm text-gray-500">Your currently configured booking windows</p>
                        </div>
                        <button
                            onClick={() => setActiveTab('create')}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-sm font-semibold hover:bg-gray-200 transition-all shadow-lg"
                        >
                            <CalendarPlus className="h-4 w-4" />
                            New Slot
                        </button>
                    </div>
                    <ManageRulesSection
                        key={rulesKey}
                        onRuleDeleted={handleRulesRefresh}
                    />
                </div>
            )}
        </div>
    );
};

export default MentorAvailabilityPage;
