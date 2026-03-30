import React from 'react';
import { Trash2, Ban, Loader2, CalendarX, RefreshCw, AlertCircle, Calendar, Repeat, CheckCircle2 } from 'lucide-react';
import { useManageRules } from '../hooks/useManageRules';
import { parseRRuleSummary, formatExdate } from '../../../shared/utils/dateUtils';

interface ManageRulesSectionProps {
    onRuleDeleted?: () => void;
}

export const ManageRulesSection: React.FC<ManageRulesSectionProps> = ({ onRuleDeleted }) => {
    const {
        rules,
        isLoading,
        deletingId,
        addingExceptionId,
        showExceptionModalForId,
        exceptionDate,
        setExceptionDate,
        setShowExceptionModalForId,
        fetchRules,
        deleteRule,
        addException
    } = useManageRules(onRuleDeleted);



    if (isLoading) {
        return (
            <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800/50 p-12 flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-400 mb-3" />
                <span className="text-gray-400 text-sm">Loading your availability rules...</span>
            </div>
        );
    }

    if (rules.length === 0) {
        return (
            <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800/50 p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mx-auto mb-4">
                    <CalendarX className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No availability rules yet</h3>
                <p className="text-sm text-gray-400 max-w-md mx-auto">
                    You haven't set up any availability rules. Create a recurring schedule or add specific dates using the "Create Availability" tab.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-4">
                    <p className="text-2xl font-bold text-white">{rules.length}</p>
                    <p className="text-xs text-gray-400">Total Rules</p>
                </div>
                <div className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-4">
                    <p className="text-2xl font-bold text-purple-400">{rules.filter(r => !r.rrule.startsWith('DTSTART:')).length}</p>
                    <p className="text-xs text-gray-400">Recurring</p>
                </div>
                <div className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-4">
                    <p className="text-2xl font-bold text-blue-400">{rules.filter(r => r.rrule.startsWith('DTSTART:')).length}</p>
                    <p className="text-xs text-gray-400">One-time</p>
                </div>
            </div>

            {/* Refresh Button */}
            <div className="flex justify-end">
                <button
                    onClick={fetchRules}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-zinc-800 transition-colors text-sm"
                >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </button>
            </div>

            {/* Rules List */}
            <div className="space-y-3">
                {rules.map(rule => {
                    const parsed = parseRRuleSummary(rule.rrule);
                    const isRecurring = parsed.type === 'recurring';

                    return (
                        <div
                            key={rule.id}
                            className="group rounded-xl border border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-zinc-700/50 transition-all overflow-hidden"
                        >
                            <div className="p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${isRecurring
                                                ? 'bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/20'
                                                : 'bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/20'
                                            }`}>
                                            {isRecurring ? (
                                                <Repeat className="h-5 w-5 text-purple-400" />
                                            ) : (
                                                <Calendar className="h-5 w-5 text-blue-400" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full ${isRecurring
                                                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                    }`}>
                                                    {isRecurring ? 'Recurring' : 'One-time'}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-emerald-400">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Active
                                                </span>
                                            </div>

                                            <p className="text-base font-semibold text-white mb-0.5">
                                                {parsed.summary}
                                            </p>
                                            <p className="text-xs text-gray-500">{parsed.details}</p>

                                            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <span className="text-gray-500">⏰</span>
                                                    {rule.startTime} - {rule.endTime}
                                                </span>
                                                <span className="text-gray-600">•</span>
                                                <span>{rule.slotDurationMinutes} min slots</span>
                                                <span className="text-gray-600">•</span>
                                                <span className="text-emerald-400 font-medium">₹{rule.slotPrice}</span>
                                            </div>

                                            {/* Exception Dates */}
                                            {rule.exdates && rule.exdates.length > 0 && (
                                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                                    <span className="text-xs text-yellow-500 flex items-center gap-1">
                                                        <AlertCircle className="h-3.5 w-3.5" />
                                                        Excluded:
                                                    </span>
                                                    {rule.exdates.map((exdate, idx) => (
                                                        <span key={idx} className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-md border border-yellow-500/20">
                                                            {formatExdate(exdate)}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {isRecurring && (
                                            <button
                                                onClick={() => setShowExceptionModalForId(rule.id)}
                                                className="p-2.5 rounded-lg text-yellow-400 hover:bg-yellow-500/10 transition-colors"
                                                title="Add exception date"
                                            >
                                                <Ban className="h-4 w-4" />
                                            </button>
                                        )}

                                        <button
                                            onClick={() => deleteRule(rule.id)}
                                            disabled={deletingId === rule.id}
                                            className="p-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                            title="Delete rule"
                                        >
                                            {deletingId === rule.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Exception Modal */}
                            {showExceptionModalForId === rule.id && (
                                <div className="border-t border-zinc-800 bg-zinc-900/50 p-5">
                                    <p className="text-sm font-medium text-white mb-3">Add Exception Date</p>
                                    <p className="text-xs text-gray-400 mb-4">Select a date to exclude from this recurring schedule. Sessions won't be available on this date.</p>
                                    <div className="flex items-end gap-3">
                                        <div className="flex-1">
                                            <input
                                                type="date"
                                                value={exceptionDate}
                                                onChange={(e) => setExceptionDate(e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                            />
                                        </div>
                                        <button
                                            onClick={() => addException(rule.id)}
                                            disabled={addingExceptionId === rule.id}
                                            className="px-5 py-2.5 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {addingExceptionId === rule.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                'Add'
                                            )}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowExceptionModalForId(null);
                                                setExceptionDate('');
                                            }}
                                            className="px-4 py-2.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-medium transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
