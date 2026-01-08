import React from 'react';
import { AvailabilityForm } from '../components/AvailabilityForm';
import { MentorshipService } from '../../../services/mentorshipService';
import toast from 'react-hot-toast';
import { BaseError } from '../../../shared/errors/BaseError';
import type { AvailabilityFormData } from '../types';


const MentorAvailabilityPage: React.FC = () => {
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (data: AvailabilityFormData) => {
        setIsLoading(true);
        try {

            let rrule = '';
            if (data.isRecurring) {
                rrule = 'FREQ=WEEKLY';
            } else {

                if(!data.date) {
                    throw new Error('Date is required for one-time availability');
                }

                const dt = data.date.replaceAll('-','');
                rrule = `DTSTART:${dt}`
            }

            const payload = {
                rrule,
                startTime: data.startTime,
                endTime: data.endTime,
                slotDurationMinutes: Number(data.slotDurationMinutes),
                bufferMinutes: Number(data.bufferMinutes)
            };

            await MentorshipService.setAvailability(payload);
            toast.success('Availability set successfully');
        } catch (error) {
            if(error instanceof BaseError)
            toast.error(error.message || 'Failed to set availability');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black pt-24 px-4">
            <AvailabilityForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
    );
};

export default MentorAvailabilityPage;
