import { inject, injectable } from 'tsyringe';
import { IGetAvailableSlotsUseCase } from '../interface/session/IGetAvailableSlotsUseCase';
import { type IMentorAvailabilityRepository } from '../../../domain/interfaces/IMentorAvailabilityRepository';
import type { IBookingReservationRepository } from '../../../domain/interfaces/IBookingReservationRepository';
import { type IRRuleSlotService } from '../../ports/slot/IRRuleSlotService';
import { type ISessionRepository } from '../../../domain/interfaces/ISessionReposiotry';
import { type ISlotConflictService } from '../../ports/slot/ISlotConflictService';
import type { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { type AvailableSlotDTO } from '../../dto/SessionDTO';
import { SessionMapper } from '../../mapper/SessionMapper';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ForbiddenError } from '../../../core/errors/ForbiddenError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { UserRole } from '../../../domain/types/UserRole';
import { MentorStatus } from '../../../domain/types/MentorStatus';

@injectable()
export class GetAvailableSlotsUseCase implements IGetAvailableSlotsUseCase {
  constructor(
    @inject('IMentorAvailabilityRepository')
    private readonly _availabilityRepo: IMentorAvailabilityRepository,
    @inject('IRRuleSlotService')
    private readonly _rruleSlotService: IRRuleSlotService,
    @inject('ISessionRepository')
    private readonly _sessionRepository: ISessionRepository,
    @inject('IBookingReservationRepository')
    private readonly _bookingReservationRepository: IBookingReservationRepository,
    @inject('ISlotConflictService')
    private readonly _slotConflictService: ISlotConflictService,
    @inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(mentorId: string, date: string): Promise<AvailableSlotDTO[]> {
    const mentor = await this._userRepository.find(mentorId);

    if (!mentor) throw new NotFoundError(ERROR_MESSAGES.USER.NOT_FOUND);
    if (
      mentor.role !== UserRole.MENTOR ||
      mentor.mentorStatus !== MentorStatus.APPROVED
    ) {
      throw new ForbiddenError(ERROR_MESSAGES.AUTH.FORBIDDEN);
    }
    const availabilities = await this._availabilityRepo.findByMentor(mentorId);

    if (availabilities.length === 0)
      throw new NotFoundError(ERROR_MESSAGES.SESSION.NO_AVAILABILITY);

    const from = new Date(date);
    from.setHours(0, 0, 0, 0);

    const to = new Date(date);
    to.setHours(23, 59, 59, 999);

    const derivedSlots = this._rruleSlotService.generateSlots(
      availabilities,
      from,
      to,
    );

    if (derivedSlots.length === 0) return [];


    const [sessions, reservations] = await Promise.all([
      this._sessionRepository.findByMentorAndDate(mentorId, date),
      this._bookingReservationRepository.findActivePendingByMentorAndDate(
        mentorId,
        date,
        new Date(),
      ),
    ]);


    const freeSlots = this._slotConflictService.filterBookedSlots(
      derivedSlots,
      [
        ...sessions,
        ...reservations.map((reservation) =>
          SessionMapper.toSessionLikeLock(reservation),
        ),
      ],
    );

    return freeSlots.map((slot) => ({
      startTime: slot.startTime,
      endTime: slot.endTime,
      price: slot.price,
    }));
  }
}
