export interface IDeleteAnswerUseCase {
  execute(userId: string, answerId: string): Promise<void>;
}
