import { inject, injectable } from 'tsyringe';
import type { IMentorAvailabilityRepository } from '../../../domain/interfaces/IMentorAvailabilityRepository';
import type { ISessionRepository } from '../../../domain/interfaces/ISessionReposiotry';
import type { IRRuleSlotService } from '../../ports/slot/IRRuleSlotService';
import type { ISlotConflictService } from '../../ports/slot/ISlotConflictService';
import type { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import type { IWalletRepository } from '../../../domain/interfaces/IWalletRepository';
import type { IWalletService } from '../../ports/wallet/IWalletService';
import type { ISessionActivationPublisher } from '../../ports/queue/ISessionActivationPublisher';
import type { ILoggerService } from '../../ports/logging/ILoggerService';
import { EntitlementResolutionService } from '../../services/EntitlementsResolutionService';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ConflictError } from '../../../core/errors/ConflictError';
import { BadRequestError } from '../../../core/errors/BadRequestError';
import { ForbiddenError } from '../../../core/errors/ForbiddenError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { UserRole } from '../../../domain/types/UserRole';
import { MentorStatus } from '../../../domain/types/MentorStatus';
import { FeatureKey } from '../../../domain/types/FeatureKey';
import { SessionStatus } from '../../../domain/types/SessionStatus';
import { SessionPaymentStatus } from '../../../domain/types/SessionPaymentStatus';
import { PaymentSource } from '../../../domain/types/PaymentSource';
import { WalletTransactionReason } from '../../../domain/types/WalletTransactionReason';
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
    private readonly _walletService: IWalletService,
    @inject('ISessionActivationPublisher')
    private readonly _sessionActivationPublisher: ISessionActivationPublisher,
    @inject('ILoggerService')
    private readonly _logger: ILoggerService,
    @inject(EntitlementResolutionService)
    private readonly _entitlementResolutionService: EntitlementResolutionService,
  ) {}

  async execute(input: BookSessionDTO): Promise<ISessionResponseDTO> {
    const { mentorId, userId, date, startTime, endTime, topic } = input;

    const studentEntitlements = await this._entitlementResolutionService.resolve(userId);
    if (!studentEntitlements.features.includes(FeatureKey.SESSION_BOOKING)) {
      throw new ForbiddenError(ERROR_MESSAGES.SESSION.SESSION_BOOKING_NOT_ALLOWED);
    }

    const mentor = await this._userRepository.find(mentorId);

    if (
      !mentor ||
      mentor.role !== UserRole.MENTOR ||
      mentor.mentorStatus !== MentorStatus.APPROVED
    ) {
      throw new ForbiddenError(ERROR_MESSAGES.AUTH.FORBIDDEN);
    }

    const availabilities = await this._availabilityRepo.findByMentor(mentorId);

    if (availabilities.length === 0) {
      throw new ConflictError(ERROR_MESSAGES.SESSION.NO_AVAILABILITY);
    }

    const from = new Date(date);
    from.setHours(0, 0, 0, 0);

    const to = new Date(date);
    to.setHours(23, 59, 59, 999);

    const start = new Date(`${date}T${startTime}:00`);
    const end = new Date(`${date}T${endTime}:00`);

    const derivedSlots = this._rruleSlotService.generateSlots(availabilities, from, to);

    const existingSessions = await this._sessionRepo.findByMentorAndDate(mentorId, date);

    const freeSlots = this._slotConflictService.filterBookedSlots(
      derivedSlots,
      existingSessions,
    );

    const matchedSlot = freeSlots.find(
      (slot) =>
        slot.date === date &&
        slot.startTime === startTime &&
        slot.endTime === endTime,
    );

    if (!matchedSlot) throw new ConflictError(ERROR_MESSAGES.SESSION.SLOT_NOT_AVAILABLE);

    const amount = matchedSlot.price;

    const wallet = await this._walletRepository.findByUserId(userId);

    if (!wallet) throw new BadRequestError(ERROR_MESSAGES.WALLET.NOT_FOUND);

    const balance = await this._walletRepository.getBalance(wallet.id);

    if (balance < amount) throw new BadRequestError(ERROR_MESSAGES.WALLET.INSUFFICIENT_BALANCE);

    let session = await this._sessionRepo.create({
        mentorId,
        userId,
        date,
        startTime: start,
        endTime: end,
        status: SessionStatus.CANCELLED,
        paymentSource: PaymentSource.WALLET,
        paymentStatus: SessionPaymentStatus.PENDING,
        paymentReferenceId: null,
        topic,
        amount,
        sessionType: matchedSlot.sessionType,
        maxGuests: matchedSlot.maxGuests,
      });

      try {
        await this._walletService.debit({
          walletId: wallet.id,
          amount,
          reason: WalletTransactionReason.SESSION_BOOKING,
          referenceId: session.id,
        });
      } catch (debitError) {
        await this._sessionRepo.update(session.id, {
          status: SessionStatus.CANCELLED,
          paymentStatus: SessionPaymentStatus.FAILED,
        });
        throw debitError;
      }

      try {
        await this._sessionRepo.update(session.id, {
          status: SessionStatus.UPCOMING,
          paymentStatus: SessionPaymentStatus.PAID,
          paymentReferenceId: session.id,
        });
      } catch (updateError) {
        try {
          await this._walletService.credit({
            walletId: wallet.id,
            amount,
            reason: WalletTransactionReason.SESSION_REFUND,
            referenceId: session.id,
          });
        } catch (refundError) {
          this._logger.error('CRITICAL: Failed to refund wallet after session transition failure', {
            sessionId: session.id,
            walletId: wallet.id,
            amount,
            error: refundError,
          });
        }

        try {
          await this._sessionRepo.update(session.id, {
            status: SessionStatus.CANCELLED,
            paymentStatus: SessionPaymentStatus.FAILED,
          });
        } catch (cleanupError) {
          this._logger.error('Failed to cleanup session after transition failure', {
            sessionId: session.id,
            error: cleanupError,
          });
        }

        if (this.isDuplicateKeyError(updateError)) {
          throw new ConflictError(ERROR_MESSAGES.SESSION.SLOT_NOT_AVAILABLE);
        }
        throw updateError;
      }

      const updated = await this._sessionRepo.find(session.id);

      if (!updated) throw new NotFoundError(ERROR_MESSAGES.SESSION.SESSION_NOT_FOUND);

      try {
        const leadTimeOffset = 15 * 60 * 1000;
        const delayMs = Math.max(0, updated.startTime.getTime() - leadTimeOffset - Date.now());
        this._logger.info(
          `[Wallet Booking Usecase] Session starts at: ${updated.startTime.toISOString()}. ` +
          `Lead time offset: 15 minutes. Computed publishing delay: ${delayMs}ms ` +
          `(${(delayMs / 1000 / 60).toFixed(2)} minutes)`,
        );
        await this._sessionActivationPublisher.publish(updated.id, delayMs);
      } catch (queueError) {
        if (queueError instanceof Error) {
          this._logger.error('Failed to publish session activation delayed event to RabbitMQ', {
            error: queueError.message,
            stack: queueError.stack,
          });
      }
    }

    return SessionMapper.toResponse(updated);
  }

  private isDuplicateKeyError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      (('code' in error && error.code === 11000) ||
        ('message' in error && String(error.message).includes('11000')) ||
        String(error).includes('E11000'))
    );
  }
}
