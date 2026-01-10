import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { MentorshipService } from '../../../services/mentorshipService';
import type { AvailableSlotResponse } from '../../../shared/types/api/mentorship';
import { Loader2, Calendar, Clock, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { BaseError } from '../../../shared/errors/BaseError';

import Header from "../../../shared/ui/Header";
import Footer from "../../../shared/ui/Footer";

const BookingPage: React.FC = () => {
    const { mentorId } = useParams<{ mentorId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const mentor = location.state?.mentor;

    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [slots, setSlots] = useState<AvailableSlotResponse[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<AvailableSlotResponse | null>(null);
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isBooking, setIsBooking] = useState(false);

    useEffect(() => {
        if (mentorId && selectedDate) {
            fetchSlots(mentorId, selectedDate);
        }
    }, [mentorId, selectedDate]);

    const fetchSlots = async (id: string, date: string) => {
        setIsLoading(true);
        try {
            const data = await MentorshipService.getAvailability(id, date);
            setSlots(data);
            setSelectedSlot(null);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load available slots");
            setSlots([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBook = async () => {
        if (!selectedSlot || !topic.trim() || !mentorId) return;

        setIsBooking(true);
        try {
            await MentorshipService.bookSession({
                mentorId,
                date: selectedDate,
                startTime: selectedSlot.startTime,
                endTime: selectedSlot.endTime,
                topic
            });
            toast.success("Session booked successfully!");
            navigate('/qna');
        } catch (error) {
            if (error instanceof BaseError)
                toast.error(error.message || "Failed to book session");
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="px-4 py-10">
                <div className="mx-auto max-w-4xl">
                    <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-white mb-8 transition">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-2">{mentor?.firstName} {mentor?.lastName || 'Mentor'}</h2>
                            <p className="text-zinc-400 mb-4">{mentor?.title || 'Mentor'}</p>
                            <div className="h-px bg-zinc-800 my-4" />
                            <h3 className="text-lg font-medium mb-4 flex items-center"><Calendar className="w-5 h-5 mr-2 text-indigo-500" /> Select Date</h3>
                            <input
                                type="date"
                                value={selectedDate}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full bg-zinc-800 border-zinc-700 rounded-lg text-white p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                            <h3 className="text-lg font-medium mb-4">Session Topic</h3>
                            <textarea
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="What would you like to discuss?"
                                className="w-full h-32 bg-zinc-800 border-zinc-700 rounded-lg text-white p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            />
                        </div>
                    </div>

                    {/* Right: Slots */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-fit">
                        <h3 className="text-lg font-medium mb-6 flex items-center"><Clock className="w-5 h-5 mr-2 text-indigo-500" /> Available Slots</h3>

                        {isLoading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                            </div>
                        ) : slots.length === 0 ? (
                            <div className="text-center py-10 text-zinc-500">
                                No slots available for this date.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 mb-8">
                                {slots.map((slot, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`p-3 rounded-lg text-sm font-medium transition-all ${selectedSlot === slot
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                                            }`}
                                    >
                                        {slot.startTime} - {slot.endTime}
                                    </button>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={handleBook}
                            disabled={!selectedSlot || !topic.trim() || isBooking}
                            className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center transition-all ${!selectedSlot || !topic.trim() || isBooking
                                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                : 'bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 shadow-lg shadow-indigo-500/20'
                                }`}
                        >
                            {isBooking ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Booking'}
                        </button>
                    </div>
                </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default BookingPage;
