import React from 'react';
import { AvailabilityForm } from '../components/AvailabilityForm';
import { MentorshipService } from '../../../services/mentorService';
import toast from 'react-hot-toast';
import { BaseError } from '../../../shared/errors/BaseError';
import type { AvailabilityFormData } from '../types';

import Header from "../../../shared/ui/Header";
import Footer from "../../../shared/ui/Footer";
import type { BookedSessionResponse } from "../../../shared/types/api/session";
import { SessionService } from '../../../services/sessionService';


const MentorAvailabilityPage: React.FC = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [sessionsLoading, setSessionsLoading] = React.useState(false);
    const [bookedSessions, setBookedSessions] = React.useState<BookedSessionResponse[]>([]);

    React.useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                setSessionsLoading(true);
                const data = await SessionService.getBookedSessions();
                if (mounted) setBookedSessions(data);
            } catch (error) {
                if (error instanceof BaseError) toast.error(error.message);
                else toast.error("Failed to load booked sessions");
            } finally {
                if (mounted) setSessionsLoading(false);
            }
        }

        load();
        return () => {
            mounted = false;
        };
    }, []);

    const handleSubmit = async (data: AvailabilityFormData) => {
        setIsLoading(true);
        try {

            let rrule = '';
            if (data.isRecurring) {
                rrule = 'FREQ=WEEKLY';
            } else {

                if(!data.date) {
                    throw new Error('Date is required for one-time availability');
                }

                const dt = data.date.replaceAll('-','');
                rrule = `DTSTART:${dt}`
            }

            const payload = {
                rrule,
                startTime: data.startTime,
                endTime: data.endTime,
                slotDurationMinutes: Number(data.slotDurationMinutes),
                bufferMinutes: Number(data.bufferMinutes),
                slotPrice:data.slotPrice
            };

            await MentorshipService.setAvailability(payload);
            toast.success('Availability set successfully');
        } catch (error) {
            if(error instanceof BaseError)
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
                    <div className="grid gap-8 lg:grid-cols-2">
                        <div className="rounded-xl border border-gray-800 bg-black px-6 py-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-white">Booked sessions</h2>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        try {
                                            setSessionsLoading(true);
                                            const data = await SessionService.getBookedSessions();
                                            setBookedSessions(data);
                                        } catch (error) {
                                            if (error instanceof BaseError) toast.error(error.message);
                                            else toast.error("Failed to load booked sessions");
                                        } finally {
                                            setSessionsLoading(false);
                                        }
                                    }}
                                    className="rounded-md border border-gray-700 bg-black px-3 py-1.5 text-xs text-gray-200 hover:bg-gray-900"
                                >
                                    Refresh
                                </button>
                            </div>

                            <div className="mt-6 space-y-4">
                                {sessionsLoading ? (
                                    <div className="text-sm text-gray-400">Loading…</div>
                                ) : bookedSessions.length === 0 ? (
                                    <div className="text-sm text-gray-400">No booked sessions are available</div>
                                ) : (
                                    bookedSessions.map((s) => (
                                        <div
                                            key={s.id}
                                            className="rounded-lg border border-gray-700 bg-black px-4 py-3"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="text-xs text-gray-400">Time slot</div>
                                                <button
                                                    type="button"
                                                    disabled
                                                    className="rounded-md bg-linear-to-r from-pink-600 to-indigo-600 px-3 py-1.5 text-xs font-semibold text-white opacity-60"
                                                >
                                                    Cancel slot
                                                </button>
                                            </div>

                                            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-200">
                                                <div className="text-gray-400">Time slot</div>
                                                <div>
                                                    {s.startTime} - {s.endTime}
                                                </div>
                                                <div className="text-gray-400">Date</div>
                                                <div>{s.date}</div>
                                                <div className="text-gray-400">Booked by</div>

                                                <div>{s.user.firstName} {s.user.lastName}</div>
                                                <div className="text-gray-400">Topic</div>
                                                <div>{s.topic}</div>
                                                <div className="text-gray-400">Status</div>
                                                <div>{s.status}</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <AvailabilityForm onSubmit={handleSubmit} isLoading={isLoading} />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default MentorAvailabilityPage;
