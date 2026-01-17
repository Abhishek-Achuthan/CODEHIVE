import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { Loader2, ArrowLeft, Calendar, Clock, CreditCard, Wallet, ShieldCheck } from 'lucide-react';

import Header from "../../../shared/ui/Header";
import Footer from "../../../shared/ui/Footer";
import { SessionService } from '../../../services/sessionService';
import { BaseError } from '../../../shared/errors/BaseError';
import type { AvailableSlotResponse } from '../../../shared/types/api/mentor';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string);

type PaymentMethod = 'WALLET' | 'STRIPE';

interface PaymentPageState {
    mentor: any;
    slot: AvailableSlotResponse;
    date: string;
    topic: string;
}

const StripePaymentModal: React.FC<{
    onClose: () => void;
    onPaid: () => void;
}> = ({ onClose, onPaid }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isPaying, setIsPaying] = useState(false);

    const handlePay = async () => {
        if (!stripe || !elements) return;

        setIsPaying(true);
        try {
            const result = await stripe.confirmPayment({
                elements,
                redirect: 'if_required',
            });

            if (result.error) {
                toast.error(result.error.message || 'Payment failed');
                return;
            }

            onPaid();
        } finally {
            setIsPaying(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                        Secure Payment
                    </h3>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">Close</button>
                </div>

                <div className="rounded-xl bg-zinc-950 p-4 border border-zinc-800 mb-6">
                    <PaymentElement />
                </div>

                <button
                    onClick={handlePay}
                    disabled={!stripe || !elements || isPaying}
                    className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center transition-all ${!stripe || !elements || isPaying
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        : 'bg-linear-to-r from-indigo-600 to-violet-600 text-white hover:opacity-90 shadow-lg shadow-indigo-500/20 hover:scale-[1.02]'
                        }`}
                >
                    {isPaying ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Pay Now'}
                </button>

                <div className="mt-4 flex justify-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Encrypted</span>
                    <span className="flex items-center gap-1">PCI Compliant</span>
                </div>
            </div>
        </div>
    );
};

const PaymentPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as PaymentPageState;

    // Redirect if direct access without state
    if (!state?.mentor || !state?.slot) {
        navigate('/mentors'); // Or back/home
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
                navigate('/qna'); // Or success page
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

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            weekday: 'long',
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="px-4 py-12">
                <div className="mx-auto max-w-3xl">
                    <button onClick={() => navigate(-1)} className="flex items-center text-zinc-400 hover:text-white mb-8 transition-colors group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Booking
                    </button>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Left: Summary */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent mb-2">
                                    Checkout
                                </h1>
                                <p className="text-zinc-400">Complete your booking securely.</p>
                            </div>

                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
                                <h3 className="font-semibold text-lg border-b border-zinc-800 pb-3">Session Details</h3>

                                <div className="space-y-3">
                                    <div>
                                        <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-1">Mentor</div>
                                        <div className="font-medium text-lg">{mentor.firstName} {mentor.lastName}</div>
                                        <div className="text-sm text-zinc-400">{mentor.title || 'Expert Mentor'}</div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-1">Date</div>
                                            <div className="flex items-center gap-2 text-zinc-200">
                                                <Calendar className="w-4 h-4 text-indigo-500" />
                                                {formatDate(date)}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-1">Time</div>
                                            <div className="flex items-center gap-2 text-zinc-200">
                                                <Clock className="w-4 h-4 text-indigo-500" />
                                                {slot.startTime} - {slot.endTime}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-1">Topic</div>
                                        <div className="text-sm text-zinc-300 leading-relaxed max-w-full break-words bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50">
                                            {topic}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Payment */}
                        <div className="space-y-6">
                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-fit sticky top-24">
                                <h3 className="font-semibold text-lg mb-6">Payment Method</h3>

                                <div className="space-y-3 mb-8">
                                    <button
                                        onClick={() => setPaymentMethod('STRIPE')}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${paymentMethod === 'STRIPE'
                                            ? 'bg-indigo-900/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                                            : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-700'
                                            }`}
                                    >
                                        <span className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${paymentMethod === 'STRIPE' ? 'bg-indigo-500 text-white' : 'bg-zinc-800'}`}>
                                                <CreditCard className="w-5 h-5" />
                                            </div>
                                            <span className="font-medium">Card Payment</span>
                                        </span>
                                        {paymentMethod === 'STRIPE' && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />}
                                    </button>

                                    <button
                                        onClick={() => setPaymentMethod('WALLET')}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${paymentMethod === 'WALLET'
                                            ? 'bg-indigo-900/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                                            : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-700'
                                            }`}
                                    >
                                        <span className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${paymentMethod === 'WALLET' ? 'bg-indigo-500 text-white' : 'bg-zinc-800'}`}>
                                                <Wallet className="w-5 h-5" />
                                            </div>
                                            <span className="font-medium">Wallet Balance</span>
                                        </span>
                                        {paymentMethod === 'WALLET' && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />}
                                    </button>
                                </div>

                                <div className="border-t border-zinc-800 pt-4 mb-6">
                                    <div className="flex justify-between items-center text-lg font-medium">
                                        <span>Total</span>
                                        <span className="text-2xl font-bold text-white">₹{slot.price}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleBook}
                                    disabled={isBooking}
                                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center transition-all ${isBooking
                                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                        : 'bg-white text-black hover:bg-zinc-200 hover:scale-[1.02] shadow-lg shadow-white/10'
                                        }`}
                                >
                                    {isBooking ? <Loader2 className="w-5 h-5 animate-spin" /> : `Pay ₹${slot.price}`}
                                </button>

                                <p className="text-center text-xs text-zinc-500 mt-4">
                                    {paymentMethod === 'STRIPE' ? 'Secure payment via Stripe' : 'Instant payment from your wallet'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {stripeClientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret: stripeClientSecret, appearance: { theme: 'night' } }}>
                    <StripePaymentModal
                        clientSecret={stripeClientSecret}
                        onClose={() => setStripeClientSecret(null)}
                        onPaid={() => {
                            setStripeClientSecret(null);
                            toast.success('Payment successful!');
                            navigate('/qna');
                        }}
                    />
                </Elements>
            )}
        </div>
    );
};

export default PaymentPage;
