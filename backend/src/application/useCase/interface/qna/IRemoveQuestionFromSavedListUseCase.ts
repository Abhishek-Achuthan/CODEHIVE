export interface IRemoveQuestionFromSavedListUseCase {
  execute(userId: string, listId: string, questionId: string): Promise<void>;
}
