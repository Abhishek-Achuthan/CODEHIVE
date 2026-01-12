import { inject, injectable } from 'tsyringe';
import { IBookSessionUseCase } from '../interface/session/IBookSessionUseCase';
import { type IMentorAvailabilityRepository } from '../../../domain/interfaces/IMentorAvailabilityRepository';
import { type ISessionRepository } from '../../../domain/interfaces/ISessionReposiotry';
import { type IRRuleSlotService } from '../../ports/slot/IRRuleSlotService';
import { type ISlotConflictService } from '../../ports/slot/ISlotConflictService';
import { BookSessionDTO, ISessionResponseDTO } from '../../dto/SessionDTO';
import { type IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ConflictError } from '../../../core/errors/ConflictError';
import { UserRole } from '../../../domain/types/UserRole';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { SessionMapper } from '../../mapper/SessionMapper';
import { SessionStatus } from '../../../domain/types/SessionStatus';

@injectable()
export class BookSessionUseCase implements IBookSessionUseCase {
  constructor(
    @inject('IMentorAvailabilityRepository')
    private readonly _availabilityRepo: IMentorAvailabilityRepository,
    @inject('ISessionRepository')
    private readonly _sessionRepo: ISessionRepository,
    @inject('IRRuleSlotService')
    private readonly _rruleSlotService: IRRuleSlotService,
    @inject('ISlotConflictService')
    private readonly _slotConflictService: ISlotConflictService,
    @inject('IUserRepository')
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(input: BookSessionDTO): Promise<ISessionResponseDTO> {
    const { mentorId, userId, date, startTime, endTime, topic } = input;

    const mentor = await this._userRepository.find(mentorId);

    if (
      !mentor ||
      mentor.role !== UserRole.MENTOR ||
      mentor.mentorStatus !== 'approved'
    ) {
      throw new NotFoundError(ERROR_MESSAGES.SESSION.MENTOR_NOT_FOUND);
    }

    const availabilities = await this._availabilityRepo.findByMentor(mentorId);

    if (availabilities.length === 0)
      throw new ConflictError(ERROR_MESSAGES.SESSION.NO_AVAILABILITY);

    const from = new Date(date);
    from.setHours(0,0,0,0);

    const to = new Date(date);
    to.setHours(23,59,59,999);

    const start = new Date(`${date}T${startTime}:00`);

    const end = new Date(`${date}T${endTime}:00`);

    const derivedSlots = this._rruleSlotService.generateSlots(
      availabilities,
      from,
      to,
    );

    const existingSessions = await this._sessionRepo.findByMentorAndDate(
      mentorId,
      date
    );

    const freeSlots = this._slotConflictService.filterBookedSlots(
      derivedSlots,
      existingSessions
    );

    const matchedSlot = freeSlots.find(
      (slot) => 
        slot.date === date && 
      slot.startTime === startTime && 
      slot.endTime === endTime
    )

    if (!matchedSlot) {
      throw new ConflictError(ERROR_MESSAGES.SESSION.SLOT_NOT_AVAILABLE);
    }

    const amountPaid = matchedSlot.price;

    const session = await this._sessionRepo.create({
      mentorId,
      userId,
      date, 
      startTime:start,
      endTime:end,
      status: SessionStatus.UPCOMING,
      topic,
      amountPaid  
    });

    return SessionMapper.toResponse(session)
  }
}
