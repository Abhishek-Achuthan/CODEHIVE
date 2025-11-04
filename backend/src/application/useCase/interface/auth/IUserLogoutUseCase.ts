export interface IUserLogoutUseCase {
    execute(token:string) :Promise<void>
}