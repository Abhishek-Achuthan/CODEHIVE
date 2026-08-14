import { container } from 'tsyringe';
import { IMessageQueueService } from '../application/ports/queue/IMessageQueueService';
import { SessionActivationConsumer } from '../infrastructure/queue/consumer/SessionActivationConsumer';
import { SessionActivationDlqConsumer } from '../infrastructure/queue/consumer/SessionActivationDlqConsumer';
import { RoomLifecycleConsumer } from '../infrastructure/queue/consumer/RoomLifecycleConsumer';
import { SessionReminderConsumer } from '../infrastructure/queue/consumer/SessionReminderConsumer';

export async function initializeRabbitMQConnection(): Promise<void> {
  const queueService = container.resolve<IMessageQueueService>('IMessageQueueService');
  
  try {
    await queueService.connect();
    
    const channel = queueService.getChannel();
    if (!channel) throw new Error('[Queue Startup] RabbitMQ channel could not be created');

    await channel.assertExchange('session.delayed.exchange', 'x-delayed-message', {
      durable: true,
      arguments: { 'x-delayed-type': 'direct' }
    });

    await channel.assertExchange('session.dlx', 'direct', { durable: true });

    await channel.assertQueue('session.activation.dlq', { durable: true });
    await channel.bindQueue('session.activation.dlq', 'session.dlx', 'session.dlq');

    await channel.assertQueue('session.activation.queue', {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': 'session.dlx',
        'x-dead-letter-routing-key': 'session.dlq'
      }
    });
    
    await channel.bindQueue('session.activation.queue', 'session.delayed.exchange', 'session.activate');

    await channel.assertQueue('room.lifecycle.queue', {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': 'session.dlx',
        'x-dead-letter-routing-key': 'session.dlq',
      },
    });

    await channel.bindQueue('room.lifecycle.queue', 'session.delayed.exchange', 'room.lifecycle');

    await channel.assertQueue('session.reminder.queue', {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': 'session.dlx',
        'x-dead-letter-routing-key': 'session.dlq',
      },
    });

    await channel.bindQueue('session.reminder.queue', 'session.delayed.exchange', 'session.reminder');

    const mainConsumer = container.resolve(SessionActivationConsumer);
    await mainConsumer.start();

    const dlqConsumer = container.resolve(SessionActivationDlqConsumer);
    await dlqConsumer.start();

    const roomLifecycleConsumer = container.resolve(RoomLifecycleConsumer);
    await roomLifecycleConsumer.start();

    const reminderConsumer = container.resolve(SessionReminderConsumer);
    await reminderConsumer.start();
  } catch (queueError) {
    console.error('Failed to initialize or connect to RabbitMQ/CloudAMQP:', queueError);
    process.exit(1);
  }
}

