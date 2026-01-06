import { inject, injectable } from 'tsyringe';
import { IBookSessionUseCase } from '../interface/session/IBookSessionUseCase';
import { type IMentorAvailablityRepository } from '../../../domain/interfaces/IMentorAvailablityRepository';
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

@injectable()
export class BookSessionUseCase implements IBookSessionUseCase {
  constructor(
    @inject('IMentorAvailablityRepository')
    private readonly _availabilityRepo: IMentorAvailablityRepository,
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
    const { mentorId, userId, date, startTime, endTime } = input;

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

    const derivedSlots = this._rruleSlotService.generateSlots(
      availabilities,
      from,
      to
    );

    const existingSessions = await this._sessionRepo.findByMentorAndDate(
      mentorId,
      date
    );

    const freeSlots = this._slotConflictService.filterBookedSlots(
      derivedSlots,
      existingSessions
    );

    const slotIsAvailable = freeSlots.some(
      (slot) =>
        slot.date === date &&
        slot.startTime === startTime &&
        slot.endTime === endTime
    );

    if (!slotIsAvailable) {
      throw new ConflictError(ERROR_MESSAGES.SESSION.SLOT_NOT_AVAILABLE);
    }

    const session = await this._sessionRepo.create({
      mentorId,
      userId,
      date,
      startTime,
      endTime,
      status: 'upcoming',
    });

    return SessionMapper.toResponse(session)
  }
}
