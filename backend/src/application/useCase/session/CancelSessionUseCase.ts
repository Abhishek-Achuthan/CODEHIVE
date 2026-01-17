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

@injectable()
export class CancelSessionUseCase implements ICancelSessionUseCase {
  constructor(
    @inject('ISessionRepository')
    private readonly _sessionRepository: ISessionRepository,
    @inject('IWalletService')
    private readonly _walletService: IWalletService,
    @inject('IWalletRepository')
    private readonly _walletRepository: IWalletRepository

  ) { }

  async execute(sessionId: string, userId: string): Promise<boolean> {
    const session = await this._sessionRepository.find(sessionId);

    if (!session || !session.startTime) {
      throw new NotFoundError(ERROR_MESSAGES.SESSION.SESSION_NOT_FOUND);
    }

    if (session.userId !== userId) {
      throw new BadRequestError(ERROR_MESSAGES.SESSION.NOT_ALLOWED_TO_CANCEL);
    }

    if (session.paymentStatus !== SessionPaymentStatus.PAID) {
      throw new BadRequestError('Only paid sessions can be cancelled');
    }

    if (session.status === SessionStatus.CANCELLED) {
      throw new BadRequestError(ERROR_MESSAGES.SESSION.ALREADY_CANCELLED);
    }

    const now = Date.now();
    const startTimeMs = session.startTime.getTime();

    if (startTimeMs <= now) {
      throw new BadRequestError(ERROR_MESSAGES.SESSION.ALREADY_STARTED);
    }

    const twentyFourHoursMs = 24 * 60 * 60 * 1000;

    const isRefundEligible = startTimeMs - now >= twentyFourHoursMs;

    if (isRefundEligible) {
      let wallet = await this._walletRepository.findByUserId(userId);

      if (!wallet) {
        wallet = await this._walletRepository.createWallet(userId);
      }

      const transaction: Credit = {
        walletId: wallet.id,
        amount: session.amount,
        referenceId: session.id,
        reason: WalletTransactionReason.SESSION_REFUND,
      };

      try {
        await this._walletService.credit(transaction);

        await this._sessionRepository.update(sessionId, {
          paymentStatus: SessionPaymentStatus.REFUNDED,
          status: SessionStatus.CANCELLED,
        });

        return true;
      } catch (error) {
        console.error('CRITICAL: Wallet credited but session update failed for session:', sessionId, error);
        throw error;
      }
    }

    // Not eligible for refund but still cancel
    await this._sessionRepository.update(sessionId, {
      status: SessionStatus.CANCELLED,
    });

    return true;
  }
}
