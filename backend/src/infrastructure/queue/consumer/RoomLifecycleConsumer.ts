import { inject, injectable } from 'tsyringe';

import type { IMessageQueueService } from '../../../application/ports/queue/IMessageQueueService';
import type { ITransitionRoomLifecycleUseCase } from '../../../application/useCase/interface/room/ITransitionRoomLifecycleUseCase';
import type { ILoggerService } from '../../../application/ports/logging/ILoggerService';
import { RoomLifecycleTransition } from '../../../domain/types/RoomLifecycleTransition';

@injectable()
export class RoomLifecycleConsumer {
  constructor(
    @inject('IMessageQueueService')
    private readonly _queueService: IMessageQueueService,
    @inject('ITransitionRoomLifecycleUseCase')
    private readonly _transitionUseCase: ITransitionRoomLifecycleUseCase,
    @inject('ILoggerService')
    private readonly _logger: ILoggerService,
  ) {}

  async start(): Promise<void> {
    const channel = this._queueService.getChannel();
    if (!channel) throw new Error('RabbitMQ channel is not initialized.');

    this._logger.info('Starting consumer for queue: room.lifecycle.queue');

    await channel.consume('room.lifecycle.queue', async (msg) => {
      if (!msg) return;

      let roomId = '';
      let transition = RoomLifecycleTransition.START;
      let retryCount = 0;

      try {
        const payload = JSON.parse(msg.content.toString()) as Record<string, unknown>;
        roomId = payload.roomId as string;
        transition = payload.transition as RoomLifecycleTransition;
        retryCount = (payload.retryCount as number) || 0;

        this._logger.info(
          `[Queue Consumer] Room lifecycle ${transition} for room: ${roomId} (Attempt: ${retryCount + 1})`,
        );

        await this._transitionUseCase.execute(roomId, transition);
        channel.ack(msg);
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error';
        this._logger.error(
          `[Queue Consumer] Error transitioning room lifecycle: ${roomId || 'unknown'}`,
          { error: errMsg },
        );

        if (roomId && retryCount < 3) {
          const nextAttempt = retryCount + 1;
          try {
            const retryPayload = { roomId, transition, retryCount: nextAttempt };
            const buffer = Buffer.from(JSON.stringify(retryPayload));

            channel.publish('session.delayed.exchange', 'room.lifecycle', buffer, {
              headers: { 'x-delay': 60000 },
              persistent: true,
            });
            channel.ack(msg);
          } catch {
            channel.nack(msg, false, true);
          }
        } else {
          channel.nack(msg, false, false);
        }
      }
    }, { noAck: false });

    this._logger.info('Room Lifecycle Consumer started successfully');
  }
}
