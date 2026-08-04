export interface ISetPasswordUseCase {
    execute(newPass: string, userId: string): Promise<void>
}
