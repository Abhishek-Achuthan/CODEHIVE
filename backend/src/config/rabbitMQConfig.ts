import { container } from 'tsyringe';
import { IMessageQueueService } from '../application/ports/queue/IMessageQueueService';
import { SessionActivationConsumer } from '../infrastructure/queue/consumer/SessionActivationConsumer';
import { SessionActivationDlqConsumer } from '../infrastructure/queue/consumer/SessionActivationDlqConsumer';

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

    const mainConsumer = container.resolve(SessionActivationConsumer);
    await mainConsumer.start();

    const dlqConsumer = container.resolve(SessionActivationDlqConsumer);
    await dlqConsumer.start();
  } catch (queueError) {
    console.error('Failed to initialize or connect to RabbitMQ/CloudAMQP:', queueError);
    process.exit(1);
  }
}
