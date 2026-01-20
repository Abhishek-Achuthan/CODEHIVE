import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

import Header from "../../../shared/ui/Header";
import Footer from "../../../shared/ui/Footer";
import { SessionService } from '../../../services/sessionService';
import { BaseError } from '../../../shared/errors/BaseError';
import type { AvailableSlotResponse } from '../../../shared/types/api/mentor';

import StripePaymentModal from '../components/StripePaymentModal';
import SessionSummaryCard from '../components/SessionSummaryCard';
import PaymentCard from '../components/PaymentCard';
import { type PaymentMethod } from '../components/PaymentMethodSelector';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string);

interface PaymentPageState {
    mentor: {
        id: string;
        firstName: string;
        lastName: string;
        title?: string;
    };
    slot: AvailableSlotResponse;
    date: string;
    topic: string;
}

const PaymentPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as PaymentPageState;

    if (!state?.mentor || !state?.slot) {
        navigate('/mentors');
        return null;
    }

    const { mentor, slot, date, topic } = state;

    const [isBooking, setIsBooking] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('STRIPE');
    const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);

    const handleBook = async () => {
        setIsBooking(true);
        try {
            if (paymentMethod === 'WALLET') {
                await SessionService.bookSessionWithWallet({
                    mentorId: mentor.id,
                    date,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    topic
                });
                toast.success("Session booked successfully!");
                navigate('/home');
                return;
            }

            if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
                toast.error('Stripe configuration error');
                return;
            }

            const result = await SessionService.bookSessionWithStripe({
                mentorId: mentor.id,
                date,
                startTime: slot.startTime,
                endTime: slot.endTime,
                topic
            });

            setStripeClientSecret(result.clientSecret);
        } catch (error) {
            if (error instanceof BaseError)
                toast.error(error.message || "Failed to book session");
            else
                toast.error("An unexpected error occurred");
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="px-4 py-12">
                <div className="mx-auto max-w-3xl">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-zinc-400 hover:text-white mb-8 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Booking
                    </button>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Left: Session Summary */}
                        <SessionSummaryCard
                            mentor={mentor}
                            slot={slot}
                            date={date}
                            topic={topic}
                        />

                        {/* Right: Payment */}
                        <div className="space-y-6">
                            <PaymentCard
                                price={slot.price}
                                paymentMethod={paymentMethod}
                                onPaymentMethodChange={setPaymentMethod}
                                isBooking={isBooking}
                                onBook={handleBook}
                            />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {stripeClientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret: stripeClientSecret, appearance: { theme: 'night' } }}>
                    <StripePaymentModal
                        onClose={() => setStripeClientSecret(null)}
                        onPaid={() => {
                            setStripeClientSecret(null);
                            toast.success('Payment successful!');
                            navigate('/home');
                        }}
                    />
                </Elements>
            )}
        </div>
    );
};

export default PaymentPage;
