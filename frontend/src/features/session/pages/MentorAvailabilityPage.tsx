import React, { useState } from 'react';
import { AvailabilityForm, type AvailabilityFormData } from '../components/AvailabilityForm';
import { MentorshipService } from '../../../services/mentorService';
import toast from 'react-hot-toast';
import { BaseError } from '../../../shared/errors/BaseError';

import Header from "../../../shared/ui/Header";
import Footer from "../../../shared/ui/Footer";
import { Calendar } from '../components/Calendar';

const MentorAvailabilityPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const handleSubmit = async (data: AvailabilityFormData) => {
        setIsLoading(true);
        try {
            let rrule = '';
            // Derive isRecurring from the fact that selectedDate is null
            // If selectedDate is null -> Recurring
            // If selectedDate is set -> One-time
            const isRecurring = selectedDate === null;

            if (isRecurring) {
                rrule = 'FREQ=WEEKLY';
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
            toast.success(isRecurring ? 'Recurring availability updated' : 'Availability set for date');

        } catch (error) {
            if (error instanceof BaseError)
                toast.error(error.message || 'Failed to set availability');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="px-4 py-10">
                <div className="mx-auto max-w-6xl">
                    <h1 className="mb-8 text-2xl font-bold bg-linear-to-r from-white to-gray-500 bg-clip-text text-transparent">
                        Manage Availability
                    </h1>

                    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
                        {/* Left Column: Calendar */}
                        <div className="space-y-6">
                            <Calendar
                                selectedDate={selectedDate}
                                onSelectDate={setSelectedDate}
                            />
                        </div>

                        {/* Right Column: Availability Form */}
                        <div>
                            <AvailabilityForm
                                onSubmit={handleSubmit}
                                isLoading={isLoading}
                                isRecurring={selectedDate === null}
                                selectedDate={selectedDate}
                            />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default MentorAvailabilityPage;
