export interface IStripeWebhookEventRepository {
  markProcessed(eventId: string): Promise<boolean>;
}
