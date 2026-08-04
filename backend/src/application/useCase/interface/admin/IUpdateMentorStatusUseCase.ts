export interface IUpdateMentorStatusUseCase {
    execute(id: string, status: 'approved' | 'rejected'): Promise<void>;
}
