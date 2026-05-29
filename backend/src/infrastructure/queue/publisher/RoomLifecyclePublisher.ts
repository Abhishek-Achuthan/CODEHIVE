import { inject, injectable } from 'tsyringe';

import type { IRoomLifecyclePublisher } from '../../../application/ports/queue/IRoomLifecyclePublisher';
import type { IMessageQueueService } from '../../../application/ports/queue/IMessageQueueService';
import type { ILoggerService } from '../../../application/ports/logging/ILoggerService';
import { RoomLifecycleTransition } from '../../../domain/types/RoomLifecycleTransition';

@injectable()
export class RoomLifecyclePublisher implements IRoomLifecyclePublisher {
  constructor(
    @inject('IMessageQueueService')
    private readonly _queueService: IMessageQueueService,
    @inject('ILoggerService')
    private readonly _logger: ILoggerService,
  ) {}

  async publish(
    roomId: string,
    transition: RoomLifecycleTransition,
    delayMs: number,
  ): Promise<void> {
    const channel = this._queueService.getChannel();
    if (!channel) {
      throw new Error('RabbitMQ channel is not initialized.');
    }

    const payload = { roomId, transition };
    const buffer = Buffer.from(JSON.stringify(payload));

    this._logger.info(
      `[Queue Publisher] Publishing room lifecycle ${transition} for room: ${roomId} with delay: ${delayMs}ms`,
    );

    channel.publish('session.delayed.exchange', 'room.lifecycle', buffer, {
      headers: { 'x-delay': delayMs },
      persistent: true,
    });
  }
}
