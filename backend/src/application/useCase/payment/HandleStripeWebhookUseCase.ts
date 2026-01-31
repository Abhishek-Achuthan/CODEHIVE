import { inject, injectable } from 'tsyringe';
import type { WebhookEvent } from '../../../domain/types/WebhookEvent';
import type { IHandleStripeWebhookUseCase } from '../interface/payment/IHandleStripeWebhookUseCase';
import type { IStripeWebhookEventRepository } from '../../../domain/interfaces/IStripeWebhookEventRepository';
import type { ISessionRepository } from '../../../domain/interfaces/ISessionReposiotry';
import type { ISocketService } from '../../ports/socket/ISocketService';
import { SessionPaymentStatus } from '../../../domain/types/SessionPaymentStatus';

@injectable()
export class HandleStripeWebhookUseCase implements IHandleStripeWebhookUseCase {
  constructor(
    @inject('IStripeWebhookEventRepository')
    private readonly _stripeWebhookEventRepository: IStripeWebhookEventRepository,
    @inject('ISessionRepository')
    private readonly _sessionRepository: ISessionRepository,
    @inject('ISocketService')
    private readonly _socketService: ISocketService
  ) { }

  async execute(event: WebhookEvent): Promise<void> {
    const shouldProcess =
      await this._stripeWebhookEventRepository.markProcessed(event.id);

    if (!shouldProcess) {
      return;
    }

    const data = event.data as any;
    const paymentIntentId: string | undefined = data?.object?.id;

    if (!paymentIntentId) {
      return;
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const session = await this._sessionRepository.findByPaymentReference(
          paymentIntentId
        );
        if (!session) return;

        await this._sessionRepository.update(session.id, {
          paymentStatus: SessionPaymentStatus.PAID,
        });

        this._socketService.emitToUser(session.userId, 'payment:status', {
          sessionId: session.id,
          status: 'paid',
        });
        return;
      }
      case 'payment_intent.payment_failed': {
        const session = await this._sessionRepository.findByPaymentReference(
          paymentIntentId
        );
        if (!session) return;

        await this._sessionRepository.update(session.id, {
          paymentStatus: SessionPaymentStatus.FAILED,
        });

        this._socketService.emitToUser(session.userId, 'payment:status', {
          sessionId: session.id,
          status: 'failed',
        });
        return;
      }
      default:
        return;
    }
  }
}
