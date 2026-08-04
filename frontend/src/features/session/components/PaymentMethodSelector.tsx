import React from 'react';
import { CreditCard, Wallet } from 'lucide-react';

export type PaymentMethod = 'WALLET' | 'STRIPE';

interface PaymentMethodSelectorProps {
    selected: PaymentMethod;
    onSelect: (method: PaymentMethod) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ selected, onSelect }) => {
    return (
        <div className="space-y-3">
            <button
                onClick={() => onSelect('STRIPE')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${selected === 'STRIPE'
                    ? 'bg-indigo-900/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                    : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-700'
                    }`}
            >
                <span className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${selected === 'STRIPE' ? 'bg-indigo-500 text-white' : 'bg-zinc-800'}`}>
                        <CreditCard className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Card Payment</span>
                </span>
                {selected === 'STRIPE' && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />}
            </button>

            <button
                onClick={() => onSelect('WALLET')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${selected === 'WALLET'
                    ? 'bg-indigo-900/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                    : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-700'
                    }`}
            >
                <span className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${selected === 'WALLET' ? 'bg-indigo-500 text-white' : 'bg-zinc-800'}`}>
                        <Wallet className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Wallet Balance</span>
                </span>
                {selected === 'WALLET' && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />}
            </button>
        </div>
    );
};

export default PaymentMethodSelector;
