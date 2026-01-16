import { User, Loader2 } from "lucide-react";
import type { BookedSessionResponse } from "../../../shared/types/api/session";

interface SessionCardProps {
    session: BookedSessionResponse;
    onJoinRoom: () => void;
    onCancel: () => void;
    isCancelling?: boolean;
}

export function SessionCard({ session, onJoinRoom, onCancel, isCancelling }: SessionCardProps) {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (timeStr: string) => {
        const date = new Date(timeStr);
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <div className="rounded-2xl border border-gray-800 bg-black p-5 transition-colors hover:bg-gray-950/40">
            {/* Topic Title */}
            <h3 className="text-lg font-semibold text-white">{session.topic}</h3>

            <div className="mt-4 flex items-start gap-4">
                {/* User Avatar */}
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-linear-to-br from-indigo-500 to-purple-600">
                    <div className="flex h-full w-full items-center justify-center text-white">
                        <User className="h-7 w-7" />
                    </div>
                </div>

                {/* Session Details */}
                <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400">User</span>
                        <span className="text-white font-medium">
                            {session.user.firstName} {session.user.lastName}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400">Date</span>
                        <span className="text-white">{formatDate(session.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400">Time</span>
                        <span className="text-white">
                            {formatTime(session.startTime)} - {formatTime(session.endTime)}
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                    {session.status === "upcoming" && (
                        <>
                            <button
                                onClick={onJoinRoom}
                                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-linear-to-r from-green-500 to-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-green-500/20 transition-all hover:opacity-90"
                            >
                                Join Room
                            </button>
                            <button
                                onClick={onCancel}
                                disabled={isCancelling}
                                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-linear-to-r from-red-500 to-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-red-500/20 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isCancelling ? (
                                    <>
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        Cancelling...
                                    </>
                                ) : (
                                    "Cancel"
                                )}
                            </button>
                        </>
                    )}
                    {session.status === "completed" && (
                        <span className="rounded-lg bg-green-500/10 px-4 py-2 text-xs font-medium text-green-400">
                            Completed
                        </span>
                    )}
                    {session.status === "cancelled" && (
                        <span className="rounded-lg bg-red-500/10 px-4 py-2 text-xs font-medium text-red-400">
                            Cancelled
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
