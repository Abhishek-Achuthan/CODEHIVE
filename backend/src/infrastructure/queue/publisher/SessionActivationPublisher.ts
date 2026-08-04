import { inject, injectable } from 'tsyringe';
import type { ISessionActivationPublisher } from '../../../application/ports/queue/ISessionActivationPublisher';
import type { IMessageQueueService } from '../../../application/ports/queue/IMessageQueueService';
import type { ILoggerService } from '../../../application/ports/logging/ILoggerService';

@injectable()
export class SessionActivationPublisher implements ISessionActivationPublisher {
  constructor(
    @inject('IMessageQueueService')
    private readonly _queueService: IMessageQueueService,
    @inject('ILoggerService')
    private readonly _logger: ILoggerService
  ) {}

  async publish(sessionId: string, delayMs: number): Promise<void> {
    const channel = this._queueService.getChannel();
    if (!channel) {
      throw new Error('RabbitMQ channel is not initialized.');
    }

    const payload = { sessionId };
    const buffer = Buffer.from(JSON.stringify(payload));

    this._logger.info(`[Queue Publisher] Publishing activation event for session: ${sessionId} with delay: ${delayMs}ms (${(delayMs / 1000 / 60).toFixed(2)} minutes)`);

    channel.publish('session.delayed.exchange', 'session.activate', buffer, {
      headers: { 'x-delay': delayMs },
      persistent: true
    });
  }
}
