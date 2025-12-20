export interface IDeleteSavedListUseCase {
  execute(userId: string, listId: string): Promise<void>;
}
