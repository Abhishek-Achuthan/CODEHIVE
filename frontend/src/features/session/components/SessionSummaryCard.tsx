import { User, Calendar, Clock, BookOpen, DollarSign } from 'lucide-react';
import type { AvailableSlotResponse } from '../../../shared/types/api/mentor';

interface SessionSummaryCardProps {
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

const SessionSummaryCard: React.FC<SessionSummaryCardProps> = ({ mentor, slot, date, topic }) => {
    const formatDate = (dateStr: string) => {
        const dateObj = new Date(dateStr);
        return dateObj.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatTime = (timeStr: string) => {

        let dateObj: Date;

        if (timeStr.includes('T') || timeStr.includes('-')) {
            dateObj = new Date(timeStr);
        } else {
            dateObj = new Date(`${date}T${timeStr}`);
        }

        return dateObj.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/50 to-black p-6">
            {/* Header */}
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                Session Summary
            </h2>

            {/* Mentor Info */}
            <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-800">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <User className="h-7 w-7 text-white" />
                </div>
                <div>
                    <p className="text-white font-medium text-base">
                        {mentor.firstName} {mentor.lastName}
                    </p>
                    {mentor.title && (
                        <p className="text-gray-400 text-sm mt-0.5">{mentor.title}</p>
                    )}
                </div>
            </div>

            {/* Session Details */}
            <div className="space-y-4">
                {/* Topic */}
                <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-9 h-9 shrink-0 rounded-lg bg-indigo-500/10">
                        <BookOpen className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-gray-400 text-xs uppercase tracking-wider">Topic</p>
                        <p className="text-white text-sm mt-0.5 font-medium break-words" title={topic}>
                            {topic.length > 100 ? `${topic.substring(0, 100)}...` : topic}
                        </p>
                    </div>
                </div>

                {/* Date */}
                <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500/10">
                        <Calendar className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider">Date</p>
                        <p className="text-white text-sm mt-0.5">{formatDate(date)}</p>
                    </div>
                </div>

                {/* Time */}
                <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-500/10">
                        <Clock className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider">Time</p>
                        <p className="text-white text-sm mt-0.5">
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </p>
                    </div>
                </div>

                {/* Price */}
                <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-purple-500/10">
                        <DollarSign className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider">Session Fee</p>
                        <p className="text-white text-sm mt-0.5 font-semibold">
                            ${slot.price.toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer Note */}
            <div className="mt-6 pt-5 border-t border-gray-800">
                <p className="text-gray-500 text-xs text-center">
                    Session details will be sent to your email after booking
                </p>
            </div>
        </div>
    );
};

export default SessionSummaryCard;
