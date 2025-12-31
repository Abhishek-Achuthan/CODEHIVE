export interface IRemoveAcceptedAnswerUseCase {
  execute(userId: string, questionId: string): Promise<void>;
}
