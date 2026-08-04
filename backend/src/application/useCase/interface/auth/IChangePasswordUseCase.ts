export interface IChangePasswordUseCase {
    execute(previousPass:string, newPass:string, userId:string) :Promise<void>
}