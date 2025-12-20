export interface IGetSavedListIdsForQuestionUseCase {
  execute(userId: string, questionId: string): Promise<{ listIds: string[] }>;
}
