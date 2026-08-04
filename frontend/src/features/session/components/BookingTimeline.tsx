import React from 'react';
import { CheckCircle2, Clock, PlayCircle } from 'lucide-react';

const steps = [
  {
    title: 'Booking Confirmed',
    description: 'Payment successful',
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    status: 'finish'
  },
  {
    title: 'Room Opens',
    description: '15 mins before start',
    icon: <Clock className="w-5 h-5 text-zinc-400" />,
    status: 'process'
  },
  {
    title: 'Session Starts',
    description: 'Collaboration begins',
    icon: <PlayCircle className="w-5 h-5 text-zinc-400" />,
    status: 'wait'
  }
];

const BookingTimeline: React.FC = () => {
  return (
    <div className="w-full py-6 px-2">
      <div className="flex flex-col space-y-8">
        {steps.map((step, index) => (
          <div key={index} className="relative flex items-start gap-4">
            {/* Connector Line */}
            {index !== steps.length - 1 && (
              <div className="absolute left-5 top-10 bottom-[-20px] w-0.5 bg-zinc-800" />
            )}
            
            {/* Icon Container */}
            <div className={`
              relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 
              ${step.status === 'finish' ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-zinc-800 bg-zinc-900'}
            `}>
              {step.icon}
            </div>

            {/* Content */}
            <div className="flex flex-col">
              <h4 className={`text-sm font-bold ${step.status === 'finish' ? 'text-white' : 'text-zinc-300'}`}>
                {step.title}
              </h4>
              <p className="text-xs text-zinc-500 mt-0.5">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingTimeline;
