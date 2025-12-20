export interface IRecordQuestionViewUseCase {
  execute(questionId: string, userId: string): Promise<boolean>;
}
