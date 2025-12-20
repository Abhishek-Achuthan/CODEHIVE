export interface ICreateSavedListUseCase {
  execute(userId: string, name: string): Promise<{ id: string; name: string }>;
}
