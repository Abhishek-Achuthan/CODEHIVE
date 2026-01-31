import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useSocket } from '../../../shared/socket/useSocket';

interface StripePaymentModalProps {
    onClose: () => void;
    onPaid: () => void;
}

const StripePaymentModal: React.FC<StripePaymentModalProps> = ({ onClose, onPaid }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isPaying, setIsPaying] = useState(false);
    const { socket } = useSocket();
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hasCompletedRef = useRef(false);

    const completePayment =useCallback(() => {
        if (hasCompletedRef.current) return;
        hasCompletedRef.current = true;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        onPaid();
    },[onPaid]);

    // Listen for real-time payment confirmation from webhook
    useEffect(() => {
        if (!socket) return;

        const handlePaymentStatus = (data: { sessionId: string; status: string }) => {
            if (data.status === 'paid') {
                completePayment();
            } else if (data.status === 'failed') {
                toast.error('Payment failed. Please try again.');
                setIsPaying(false);
            }
        };

        socket.on('payment:status', handlePaymentStatus);

        return () => {
            socket.off('payment:status', handlePaymentStatus);
        };
    }, [socket,completePayment]);

    const handlePay = async () => {
        if (!stripe || !elements) return;

        setIsPaying(true);
        hasCompletedRef.current = false;

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

            // Payment confirmed client-side
            // Wait for socket event, but fallback after 5 seconds
            timeoutRef.current = setTimeout(() => {
                completePayment();
            }, 5000);
        } catch {
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

export default StripePaymentModal;
