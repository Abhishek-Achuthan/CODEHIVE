import React from 'react';
import { Loader2 } from 'lucide-react';
import PaymentMethodSelector, { type PaymentMethod } from './PaymentMethodSelector';

interface PaymentCardProps {
    price: number;
    paymentMethod: PaymentMethod;
    onPaymentMethodChange: (method: PaymentMethod) => void;
    isBooking: boolean;
    onBook: () => void;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
    price,
    paymentMethod,
    onPaymentMethodChange,
    isBooking,
    onBook
}) => {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-fit sticky top-24">
            <h3 className="font-semibold text-lg mb-6">Payment Method</h3>

            <div className="mb-8">
                <PaymentMethodSelector
                    selected={paymentMethod}
                    onSelect={onPaymentMethodChange}
                />
            </div>

            <div className="border-t border-zinc-800 pt-4 mb-6">
                <div className="flex justify-between items-center text-lg font-medium">
                    <span>Total</span>
                    <span className="text-2xl font-bold text-white">₹{price}</span>
                </div>
            </div>

            <button
                onClick={onBook}
                disabled={isBooking}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center transition-all ${isBooking
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : 'bg-white text-black hover:bg-zinc-200 hover:scale-[1.02] shadow-lg shadow-white/10'
                    }`}
            >
                {isBooking ? <Loader2 className="w-5 h-5 animate-spin" /> : `Pay ₹${price}`}
            </button>

            <p className="text-center text-xs text-zinc-500 mt-4">
                {paymentMethod === 'STRIPE' ? 'Secure payment via Stripe' : 'Instant payment from your wallet'}
            </p>
        </div>
    );
};

export default PaymentCard;
