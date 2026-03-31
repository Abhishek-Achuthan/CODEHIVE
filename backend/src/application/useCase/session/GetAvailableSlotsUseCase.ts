import { inject, injectable } from 'tsyringe';
import { IGetAvailableSlotsUseCase } from '../interface/session/IGetAvailableSlotsUseCase';
import { type IMentorAvailabilityRepository } from '../../../domain/interfaces/IMentorAvailabilityRepository';
import type { IBookingReservationRepository } from '../../../domain/interfaces/IBookingReservationRepository';
import { type IRRuleSlotService } from '../../ports/slot/IRRuleSlotService';
import { type  ISessionRepository } from '../../../domain/interfaces/ISessionReposiotry';
import { type ISlotConflictService } from '../../ports/slot/ISlotConflictService';
import { type AvailableSlotDTO } from '../../dto/SessionDTO';
import { type SessionEntity } from '../../../domain/session/SessionEntity';
import {  NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { SessionStatus } from '../../../domain/types/SessionStatus';
import { SessionPaymentStatus } from '../../../domain/types/SessionPaymentStatus';
import { PaymentSource } from '../../../domain/types/PaymentSource';



@injectable()
export class GetAvailableSlotsUseCase implements IGetAvailableSlotsUseCase{
    constructor(
        @inject('IMentorAvailabilityRepository') private readonly _availabilityRepo: IMentorAvailabilityRepository,
        @inject('IRRuleSlotService') private readonly _rruleSlotService : IRRuleSlotService,
        @inject('ISessionRepository') private readonly _sessionRepository : ISessionRepository,
        @inject('IBookingReservationRepository') private readonly _bookingReservationRepository : IBookingReservationRepository,
        @inject('ISlotConflictService') private readonly _slotConflictService : ISlotConflictService,
    ){}

    async execute(mentorId: string, date: string): Promise<AvailableSlotDTO[]> {
        const availabilities = await this._availabilityRepo.findByMentor(mentorId);
        
        if(availabilities.length ===0) throw new NotFoundError(ERROR_MESSAGES.SESSION.NO_AVAILABILITY);

        const from = new Date(date);
        from.setHours(0,0,0,0);

        const to = new Date(date);
        to.setHours(23,59,59,999);

        const derivedSlots = this._rruleSlotService.generateSlots(availabilities,from,to);

        if(derivedSlots.length === 0) return [];

        const sessions = await this._sessionRepository.findByMentorAndDate(mentorId,date);
        const reservations = await this._bookingReservationRepository.findActivePendingByMentorAndDate(
            mentorId,
            date,
            new Date()
        );

        const freeSlots = this._slotConflictService.filterBookedSlots(
            derivedSlots,
            [
                ...sessions,
                ...reservations.map((reservation) => this.toSessionLikeLock(reservation))
            ]
        );

        return freeSlots.map((slot) => ({
            startTime:slot.startTime,
            endTime:slot.endTime,
            price: slot.price,
        }));
    }

    private toSessionLikeLock(reservation: {
        id: string;
        mentorId: string;
        userId: string;
        date: string;
        startTime: Date;
        endTime: Date;
        topic: string;
        amount: number;
        stripePaymentIntentId?: string;
        createdAt: Date;
        updatedAt: Date;
    }): SessionEntity {
        return {
            id: reservation.id,
            mentorId: reservation.mentorId,
            userId: reservation.userId,
            date: reservation.date,
            startTime: reservation.startTime,
            endTime: reservation.endTime,
            status: SessionStatus.UPCOMING,
            topic: reservation.topic,
            paymentStatus: SessionPaymentStatus.PENDING,
            paymentSource: PaymentSource.STRIPE,
            paymentReferenceId: reservation.stripePaymentIntentId ?? null,
            amount: reservation.amount,
            createdAt: reservation.createdAt,
            updatedAt: reservation.updatedAt,
        };
    }

}
