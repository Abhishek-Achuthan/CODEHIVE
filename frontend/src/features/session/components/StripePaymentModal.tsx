import React, { useEffect, useMemo, useState } from 'react';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { Loader2, ShieldCheck } from 'lucide-react';
import { SessionService } from '../../../services/sessionService';

interface StripePaymentModalProps {
    reservationId: string;
    expiresAt: string;
    onClose: () => void;
    onPaid: (sessionId: string) => void;
}

const StripePaymentModal: React.FC<StripePaymentModalProps> = ({
    reservationId,
    expiresAt,
    onClose,
    onPaid,
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isPaying, setIsPaying] = useState(false);
    const [isPolling, setIsPolling] = useState(false);
    const [timeLeftMs, setTimeLeftMs] = useState(() => new Date(expiresAt).getTime() - Date.now());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeftMs(new Date(expiresAt).getTime() - Date.now());
        }, 1000);

        return () => clearInterval(timer);
    }, [expiresAt]);

    const formattedTimeLeft = useMemo(() => {
        const safeMs = Math.max(timeLeftMs, 0);
        const totalSeconds = Math.floor(safeMs / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, [timeLeftMs]);

    useEffect(() => {
        if (!isPolling) {
            return;
        }

        let isCancelled = false;
        const interval = setInterval(async () => {
            try {
                const reservation = await SessionService.getBookingReservation(reservationId);

                if (isCancelled) {
                    return;
                }

                if (reservation.status === 'FULFILLED' && reservation.sessionId) {
                    clearInterval(interval);
                    onPaid(reservation.sessionId);
                    return;
                }

                if (reservation.status === 'FAILED' || reservation.status === 'EXPIRED') {
                    clearInterval(interval);
                    setIsPolling(false);
                    setIsPaying(false);
                    toast.error(
                        reservation.status === 'EXPIRED'
                            ? 'Payment window expired.'
                            : 'Payment could not be completed.'
                    );
                }
            } catch (error) {
                if (error instanceof Error) {
                    console.error('Failed to poll booking reservation', error.message);
                }
            }
        }, 2000);

        return () => {
            isCancelled = true;
            clearInterval(interval);
        };
    }, [isPolling, onPaid, reservationId]);

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
                setIsPaying(false);
                return;
            }

            setIsPolling(true);
        } catch {
            setIsPaying(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-green-500" />
                            Secure Payment
                        </h3>
                        <p className="mt-1 text-xs text-zinc-500">
                            Reservation expires in {formattedTimeLeft}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">Close</button>
                </div>

                <div className="rounded-xl bg-zinc-950 p-4 border border-zinc-800 mb-6">
                    <PaymentElement />
                </div>

                <button
                    onClick={handlePay}
                    disabled={!stripe || !elements || isPaying || isPolling || timeLeftMs <= 0}
                    className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center transition-all ${!stripe || !elements || isPaying || isPolling || timeLeftMs <= 0
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        : 'bg-linear-to-r from-indigo-600 to-violet-600 text-white hover:opacity-90 shadow-lg shadow-indigo-500/20 hover:scale-[1.02]'
                        }`}
                >
                    {isPaying || isPolling ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Pay Now'}
                </button>

                <div className="mt-4 flex justify-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Encrypted</span>
                    <span className="flex items-center gap-1">PCI Compliant</span>
                </div>
            </div>
        </div>
    );
};

export default StripePaymentModal;
