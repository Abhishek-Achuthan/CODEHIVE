import { inject, injectable } from 'tsyringe';
import type { IMentorAvailabilityRepository } from '../../../domain/interfaces/IMentorAvailabilityRepository';
import type { ISessionRepository } from '../../../domain/interfaces/ISessionReposiotry';
import type { IRRuleSlotService } from '../../ports/slot/IRRuleSlotService';
import type { ISlotConflictService } from '../../ports/slot/ISlotConflictService';
import type { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import type { IWalletRepository } from '../../../domain/interfaces/IWalletRepository';
import type { IWalletService } from '../../ports/wallet/IWalletService';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ConflictError } from '../../../core/errors/ConflictError';
import { BadRequestError } from '../../../core/errors/BadRequestError';
import { ForbiddenError } from '../../../core/errors/ForbiddenError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { UserRole } from '../../../domain/types/UserRole';
import { SessionStatus } from '../../../domain/types/SessionStatus';
import { SessionPaymentStatus } from '../../../domain/types/SessionPaymentStatus';
import { PaymentSource } from '../../../domain/types/PaymentSource';
import { WalletTransactionReason } from '../../../domain/types/WalletTransactionReason';
import { MentorStatus } from '../../../domain/types/MentorStatus';
import { SessionMapper } from '../../mapper/SessionMapper';
import { BookSessionDTO, ISessionResponseDTO } from '../../dto/SessionDTO';
import type { IBookSessionWithWalletUseCase } from '../interface/session/IBookSessionWithWalletUseCase';

@injectable()
export class BookSessionWithWalletUseCase implements IBookSessionWithWalletUseCase {
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
    private readonly _userRepository: IUserRepository,
    @inject('IWalletRepository')
    private readonly _walletRepository: IWalletRepository,
    @inject('IWalletService')
    private readonly _walletService: IWalletService
  ) { }

  async execute(input: BookSessionDTO): Promise<ISessionResponseDTO> {
    const { mentorId, userId, date, startTime, endTime, topic } = input;

    const mentor = await this._userRepository.find(mentorId);

    if (
      !mentor ||
      mentor.role !== UserRole.MENTOR ||
      mentor.mentorStatus !== MentorStatus.APPROVED
    ) 
     throw new ForbiddenError(ERROR_MESSAGES.AUTH.FORBIDDEN);
    

    const availabilities = await this._availabilityRepo.findByMentor(mentorId);

    if (availabilities.length === 0)
      throw new ConflictError(ERROR_MESSAGES.SESSION.NO_AVAILABILITY);

    const from = new Date(date);
    from.setHours(0, 0, 0, 0);

    const to = new Date(date);
    to.setHours(23, 59, 59, 999);

    const start = new Date(`${date}T${startTime}:00`);
    const end = new Date(`${date}T${endTime}:00`);

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

    const matchedSlot = freeSlots.find(
      (slot) =>
        slot.date === date &&
        slot.startTime === startTime &&
        slot.endTime === endTime
    );

    if (!matchedSlot) {
      throw new ConflictError(ERROR_MESSAGES.SESSION.SLOT_NOT_AVAILABLE);
    }

    const amount = matchedSlot.price;

    const wallet = await this._walletRepository.findByUserId(userId);

    if (!wallet) 
      throw new BadRequestError(ERROR_MESSAGES.WALLET.NOT_FOUND);
    

    const balance = await this._walletRepository.getBalance(wallet.id);

    if (balance < amount) 
      throw new BadRequestError(ERROR_MESSAGES.WALLET.INSUFFICIENT_BALANCE);
    


    let session;
    try {
      session = await this._sessionRepo.create({
        mentorId,
        userId,
        date,
        startTime: start,
        endTime: end,
        status: SessionStatus.UPCOMING,
        paymentSource: PaymentSource.WALLET,
        paymentStatus: SessionPaymentStatus.PAID,
        paymentReferenceId: null,
        topic,
        amount,
      });

      await this._walletService.debit({
        walletId: wallet.id,
        amount,
        reason: WalletTransactionReason.SESSION_BOOKING,
        referenceId: session.id,
      });

      await this._sessionRepo.update(session.id, {
        paymentReferenceId: session.id,
      });

      const updated = await this._sessionRepo.find(session.id);

      if (!updated) 
        throw new NotFoundError(ERROR_MESSAGES.SESSION.SESSION_NOT_FOUND);
      

      return SessionMapper.toResponse(updated);
    } catch (error) {
      if (session) {
        await this._sessionRepo.delete(session.id);
      }
      throw error;
    }
  }
}
