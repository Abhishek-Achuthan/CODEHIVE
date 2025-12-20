export interface IDeleteQuestionUseCase {
  execute(userId: string, questionId: string): Promise<void>;
}
