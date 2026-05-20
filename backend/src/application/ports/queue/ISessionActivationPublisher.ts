export interface ISessionActivationPublisher {
  publish(sessionId: string, delayMs: number): Promise<void>;
}
