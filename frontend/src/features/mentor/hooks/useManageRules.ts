import { useState, useEffect, useCallback } from 'react';
import { MentorshipService } from '../../../services/mentorService';
import type { MentorAvailabilityResponse } from '../../../shared/types/api/mentor';
import toast from 'react-hot-toast';

interface UseManageRulesReturn {
    rules: MentorAvailabilityResponse[];
    isLoading: boolean;
    deletingId: string | null;
    addingExceptionId: string | null;
    showExceptionModalForId: string | null;
    exceptionDate: string;
    setExceptionDate: (date: string) => void;
    setShowExceptionModalForId: (id: string | null) => void;
    fetchRules: () => Promise<void>;
    deleteRule: (id: string) => Promise<void>;
    addException: (id: string) => Promise<void>;
}

export const useManageRules = (onRuleDeleted?: () => void): UseManageRulesReturn => {
    const [rules, setRules] = useState<MentorAvailabilityResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [addingExceptionId, setAddingExceptionId] = useState<string | null>(null);
    const [showExceptionModalForId, setShowExceptionModalForId] = useState<string | null>(null);
    const [exceptionDate, setExceptionDate] = useState<string>('');

    const fetchRules = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await MentorshipService.getMyAvailability();
            setRules(data);
        } catch {
            toast.error('Failed to load availability rules');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRules();
    }, [fetchRules]);

    const deleteRule = async (id: string) => {
        if (!confirm('Are you sure you want to delete this availability rule?')) return;

        setDeletingId(id);
        try {
            await MentorshipService.deleteAvailability(id);
            setRules(prev => prev.filter(r => r.id !== id));
            toast.success('Availability rule deleted');
            onRuleDeleted?.();
        } catch {
            toast.error('Failed to delete rule');
        } finally {
            setDeletingId(null);
        }
    };

    const addException = async (id: string) => {
        if (!exceptionDate) {
            toast.error('Please select a date');
            return;
        }

        setAddingExceptionId(id);
        try {
            const updated = await MentorshipService.addException(id, exceptionDate);
            setRules(prev => prev.map(r => r.id === id ? updated : r));
            toast.success('Exception date added');
            setShowExceptionModalForId(null);
            setExceptionDate('');
        } catch {
            toast.error('Failed to add exception date');
        } finally {
            setAddingExceptionId(null);
        }
    };

    return {
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
    };
};

