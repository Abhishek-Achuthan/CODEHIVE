import React, { useState, useCallback } from 'react';
import { AvailabilityForm } from '../components/AvailabilityForm';
import type { AvailabilityFormData } from '../types';
import { MentorshipService } from '../../../services/mentorService';
import toast from 'react-hot-toast';
import { BaseError } from '../../../shared/errors/BaseError';
import { CalendarPlus, ListTodo, Clock, Calendar as CalendarIcon, Sparkles } from 'lucide-react';

import Header from "../../../shared/ui/Header";
import Footer from "../../../shared/ui/Footer";
import { Calendar } from '../components/Calendar';
import { ManageRulesSection } from '../components/ManageRulesSection';

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
        <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950 text-white">
            <Header />

            <main className="px-4 py-8 lg:py-12">
                <div className="mx-auto max-w-6xl">
                    {/* Page Header */}
                    <div className="mb-10 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 mb-4">
                            <Sparkles className="h-4 w-4 text-indigo-400" />
                            <span className="text-xs font-medium text-indigo-300 uppercase tracking-wider">Mentor Dashboard</span>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-3">
                            Manage Your Availability
                        </h1>
                        <p className="text-gray-400 max-w-xl mx-auto lg:mx-0">
                            Set up your schedule so students can book mentorship sessions with you. Create recurring schedules or add specific dates.
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="mb-8">
                        <div className="inline-flex rounded-xl bg-zinc-900/80 border border-zinc-800 p-1.5 backdrop-blur-sm">
                            <button
                                onClick={() => setActiveTab('create')}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'create'
                                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
                                        : 'text-gray-400 hover:text-white hover:bg-zinc-800'
                                    }`}
                            >
                                <CalendarPlus className="h-4 w-4" />
                                Create Availability
                            </button>
                            <button
                                onClick={() => setActiveTab('manage')}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'manage'
                                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
                                        : 'text-gray-400 hover:text-white hover:bg-zinc-800'
                                    }`}
                            >
                                <ListTodo className="h-4 w-4" />
                                Manage Rules
                            </button>
                        </div>
                    </div>

                    {/* Create Tab Content */}
                    {activeTab === 'create' && (
                        <div className="space-y-8">
                            {/* Instructions Banner */}
                            <div className="rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-indigo-600/20 flex items-center justify-center">
                                            <CalendarIcon className="h-6 w-6 text-indigo-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">How it works</h3>
                                            <p className="text-sm text-gray-400">Quick 2-step process</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold">1</div>
                                            <div>
                                                <p className="text-sm font-medium text-white">Choose schedule type</p>
                                                <p className="text-xs text-gray-400">Pick a date or set recurring</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-violet-600 flex items-center justify-center text-sm font-bold">2</div>
                                            <div>
                                                <p className="text-sm font-medium text-white">Configure time slots</p>
                                                <p className="text-xs text-gray-400">Set times, duration & pricing</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content Grid */}
                            <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
                                {/* Left Column - Calendar */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="h-5 w-5 text-indigo-400" />
                                        <h2 className="text-lg font-semibold text-white">Step 1: Select Schedule Type</h2>
                                    </div>

                                    {/* Schedule Type Cards */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <button
                                            onClick={() => setSelectedDate(null)}
                                            className={`p-4 rounded-xl border transition-all text-left ${selectedDate === null
                                                    ? 'bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border-purple-500/40 shadow-lg shadow-purple-500/10'
                                                    : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                                                }`}
                                        >
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${selectedDate === null ? 'bg-purple-500/20' : 'bg-zinc-800'
                                                }`}>
                                                <svg className={`w-5 h-5 ${selectedDate === null ? 'text-purple-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                            </div>
                                            <p className={`font-medium ${selectedDate === null ? 'text-white' : 'text-gray-300'}`}>Recurring</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Weekly schedule</p>
                                        </button>

                                        <button
                                            onClick={() => setSelectedDate(new Date())}
                                            className={`p-4 rounded-xl border transition-all text-left ${selectedDate !== null
                                                    ? 'bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-500/40 shadow-lg shadow-blue-500/10'
                                                    : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                                                }`}
                                        >
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${selectedDate !== null ? 'bg-blue-500/20' : 'bg-zinc-800'
                                                }`}>
                                                <CalendarIcon className={`w-5 h-5 ${selectedDate !== null ? 'text-blue-400' : 'text-gray-400'}`} />
                                            </div>
                                            <p className={`font-medium ${selectedDate !== null ? 'text-white' : 'text-gray-300'}`}>One-time</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Specific date</p>
                                        </button>
                                    </div>

                                    {/* Calendar - only show for one-time */}
                                    {selectedDate !== null && (
                                        <Calendar
                                            selectedDate={selectedDate}
                                            onSelectDate={(date) => date && setSelectedDate(date)}
                                            showRecurringOption={false}
                                        />
                                    )}

                                    {/* Recurring info */}
                                    {selectedDate === null && (
                                        <div className="rounded-xl bg-purple-500/5 border border-purple-500/20 p-4">
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 mt-0.5">
                                                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-purple-300">Recurring Schedule</p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        Configure which days of the week you're available. You can set duration limits in the form.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column - Form */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="h-5 w-5 rounded bg-violet-600 flex items-center justify-center text-xs font-bold">2</div>
                                        <h2 className="text-lg font-semibold text-white">Configure Time Slots</h2>
                                    </div>
                                    <AvailabilityForm
                                        onSubmit={handleSubmit}
                                        isLoading={isLoading}
                                        isRecurring={selectedDate === null}
                                        selectedDate={selectedDate}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Manage Tab Content */}
                    {activeTab === 'manage' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-white mb-1">Your Availability Rules</h2>
                                    <p className="text-sm text-gray-400">View, edit, or delete your existing schedules</p>
                                </div>
                                <button
                                    onClick={() => setActiveTab('create')}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
                                >
                                    <CalendarPlus className="h-4 w-4" />
                                    Add New
                                </button>
                            </div>
                            <ManageRulesSection
                                key={rulesKey}
                                onRuleDeleted={handleRulesRefresh}
                            />
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default MentorAvailabilityPage;
