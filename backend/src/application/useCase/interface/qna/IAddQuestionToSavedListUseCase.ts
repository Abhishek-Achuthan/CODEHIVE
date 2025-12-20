export interface IAddQuestionToSavedListUseCase {
  execute(userId: string, listId: string, questionId: string): Promise<void>;
}
