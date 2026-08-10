import { inject, injectable } from 'tsyringe';
import { ICancelSessionUseCase } from '../interface/session/ICancelSessionUseCase';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { BadRequestError } from '../../../core/errors/BadRequestError';
import { type ISessionRepository } from '../../../domain/interfaces/ISessionReposiotry';
import { type IWalletService } from '../../ports/wallet/IWalletService';
import { type IWalletRepository } from '../../../domain/interfaces/IWalletRepository';
import { Credit } from '../../../domain/types/WalletTransactionInput';
import { WalletTransactionReason } from '../../../domain/types/WalletTransactionReason';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { SessionStatus } from '../../../domain/types/SessionStatus';
import { SessionPaymentStatus } from '../../../domain/types/SessionPaymentStatus';
import type { INotificationService } from '../../ports/notifications/INotificationService';

@injectable()
export class CancelSessionUseCase implements ICancelSessionUseCase {
  constructor(
    @inject('ISessionRepository')
    private readonly _sessionRepository: ISessionRepository,
    @inject('IWalletService')
    private readonly _walletService: IWalletService,
    @inject('IWalletRepository')
    private readonly _walletRepository: IWalletRepository,
    @inject('INotificationService')
    private readonly _notificationService: INotificationService
  ) { }

  async execute(sessionId: string, userId: string): Promise<boolean> {
    const session = await this._sessionRepository.find(sessionId);

    if (!session || !session.startTime) {
      throw new NotFoundError(ERROR_MESSAGES.SESSION.SESSION_NOT_FOUND);
    }

    const isMentorCancelling = session.mentorId === userId;
    const isMenteeCancelling = session.userId === userId;

    if (!isMentorCancelling && !isMenteeCancelling) {
      throw new BadRequestError(ERROR_MESSAGES.SESSION.NOT_ALLOWED_TO_CANCEL);
    }

    if (session.paymentStatus !== SessionPaymentStatus.PAID) {
      throw new BadRequestError(ERROR_MESSAGES.SESSION.ONLY_PAID_SESSIONS_CANCELLABLE);
    }

    if (session.status === SessionStatus.CANCELLED) {
      throw new BadRequestError(ERROR_MESSAGES.SESSION.ALREADY_CANCELLED);
    }

    const now = Date.now();
    const startTimeMs = session.startTime.getTime();

    if (startTimeMs <= now) {
      throw new BadRequestError(ERROR_MESSAGES.SESSION.ALREADY_STARTED);
    }

    if (isMentorCancelling) {
      await this._refundAndCancelSession(sessionId, session.userId, session.amount);
      await this._notificationService.notify({
        recipientId: session.userId,
        type: 'WARNING',
        category: 'SESSION',
        title: 'Session Cancelled',
        message: 'Your session has been cancelled by the mentor. A refund has been issued to your wallet if applicable.',
      });
      return true;
    }

    const twentyFourHoursMs = 24 * 60 * 60 * 1000;
    const isRefundEligible = startTimeMs - now >= twentyFourHoursMs;

    if (isRefundEligible) {
      await this._refundAndCancelSession(sessionId, userId, session.amount);
      await this._notificationService.notify({
        recipientId: session.mentorId,
        type: 'WARNING',
        category: 'SESSION',
        title: 'Session Cancelled',
        message: 'Your upcoming session was cancelled by the mentee.',
      });
      return true;
    }

    await this._sessionRepository.update(sessionId, {
      status: SessionStatus.CANCELLED,
    });

    await this._notificationService.notify({
      recipientId: session.mentorId,
      type: 'WARNING',
      category: 'SESSION',
      title: 'Session Cancelled',
      message: 'Your upcoming session was cancelled by the mentee.',
    });

    return true;
  }

  private async _refundAndCancelSession(
    sessionId: string,
    refundUserId: string,
    amount: number
  ): Promise<void> {
    let wallet = await this._walletRepository.findByUserId(refundUserId);

    if (!wallet) {
      wallet = await this._walletRepository.createWallet(refundUserId);
    }

    const transaction: Credit = {
      walletId: wallet.id,
      amount,
      referenceId: sessionId,
      reason: WalletTransactionReason.SESSION_REFUND,
    };

    await this._sessionRepository.update(sessionId, {
      paymentStatus: SessionPaymentStatus.REFUNDED,
      status: SessionStatus.CANCELLED,
    });

    try {
      await this._walletService.credit(transaction);
    } catch (error) {
      await this._sessionRepository.update(sessionId, {
        paymentStatus: SessionPaymentStatus.PAID,
        status: SessionStatus.UPCOMING,
      });
      throw error;
    }
  }
}
