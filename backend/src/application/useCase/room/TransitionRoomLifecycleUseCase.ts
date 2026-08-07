import { inject, injectable } from 'tsyringe';
import type { IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import type { IRoomEventEmitter } from '../../ports/realtime/IRoomEventEmitter';
import { RoomLifecycleTransition } from '../../../domain/types/RoomLifecycleTransition';
import { RoomLifecycleTransitionService } from '../../../domain/services/RoomLifecycleTransitionService';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import type { ITransitionRoomLifecycleUseCase } from '../interface/room/ITransitionRoomLifecycleUseCase';
import type { ISessionRepository } from '../../../domain/interfaces/ISessionReposiotry';
import type { IWalletRepository } from '../../../domain/interfaces/IWalletRepository';
import type { IWalletService } from '../../ports/wallet/IWalletService';
import type { INotificationService } from '../../ports/notifications/INotificationService';
import type { ILoggerService } from '../../ports/logging/ILoggerService';
import { RoomLifeCycleStatus } from '../../../domain/types/RoomLifeCycleStatus';
import { SessionStatus } from '../../../domain/types/SessionStatus';
import { WalletTransactionReason } from '../../../domain/types/WalletTransactionReason';
import { Credit } from '../../../domain/types/WalletTransactionInput';

@injectable()
export class TransitionRoomLifecycleUseCase implements ITransitionRoomLifecycleUseCase {
  constructor(
    @inject('IRoomRepository')
    private readonly _roomRepository: IRoomRepository,
    @inject(RoomLifecycleTransitionService)
    private readonly _lifecycleTransitionService: RoomLifecycleTransitionService,
    @inject('IRoomEventEmitter')
    private readonly _roomEventEmitter: IRoomEventEmitter,
    @inject('ISessionRepository')
    private readonly _sessionRepository: ISessionRepository,
    @inject('IWalletRepository')
    private readonly _walletRepository: IWalletRepository,
    @inject('IWalletService')
    private readonly _walletService: IWalletService,
    @inject('INotificationService')
    private readonly _notificationService: INotificationService,
    @inject('ILoggerService')
    private readonly _logger: ILoggerService,
  ) {}

  async execute(roomId: string, transition: RoomLifecycleTransition): Promise<void> {
    const room = await this._roomRepository.find(roomId);
    if (!room) {
      throw new NotFoundError(ERROR_MESSAGES.ROOM.ROOM_NOT_FOUND);
    }

    const result = this._lifecycleTransitionService.resolveTransition(
      room,
      transition,
      new Date(),
    );

    if (!result) return;

    const updated = await this._roomRepository.update(roomId, result.updates);

    if (!updated) return;

    this._roomEventEmitter.emitLifecycleChanged(roomId, result.nextStatus);

    if (
      (result.nextStatus === RoomLifeCycleStatus.READONLY ||
        result.nextStatus === RoomLifeCycleStatus.ARCHIVED) &&
      room.sessionId
    ) {
      await this._handleSessionCompletion(room.sessionId);
    }
  }

  private async _handleSessionCompletion(sessionId: string): Promise<void> {
    try {
      const session = await this._sessionRepository.find(sessionId);
      if (!session) return;

      const statusLower = String(session.status).toLowerCase();
      if (statusLower === SessionStatus.COMPLETED || statusLower === SessionStatus.CANCELLED) {
        return;
      }

      await this._sessionRepository.update(sessionId, {
        status: SessionStatus.COMPLETED,
      });

      let mentorWallet = await this._walletRepository.findByUserId(session.mentorId);
      if (!mentorWallet) {
        mentorWallet = await this._walletRepository.createWallet(session.mentorId);
      }

      const creditInput: Credit = {
        walletId: mentorWallet.id,
        amount: session.amount,
        reason: WalletTransactionReason.SESSION_PAYOUT,
        referenceId: sessionId,
      };

      await this._walletService.credit(creditInput);

      this._logger.info(
        `[Session Completion] Successfully completed session ${sessionId} and credited ₹${session.amount} to mentor wallet ${mentorWallet.id}`,
      );

      await this._notificationService.notify({
        recipientId: session.mentorId,
        type: 'SUCCESS',
        category: 'SESSION',
        title: 'Session Earnings Credited',
        message: `₹${session.amount} has been credited to your wallet for completing the session.`,
      });

      await this._notificationService.notify({
        recipientId: session.userId,
        type: 'INFO',
        category: 'SESSION',
        title: 'Session Completed',
        message: `Your mentoring session has been completed.`,
      });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      this._logger.error(
        `[Session Completion Error] Failed to complete session or credit mentor wallet for sessionId: ${sessionId}`,
        { error: errMsg },
      );
    }
  }
}
