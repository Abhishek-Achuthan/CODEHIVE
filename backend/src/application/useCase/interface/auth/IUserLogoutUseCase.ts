export interface IUserLogoutUseCase {
    execute(token:string,email:string) :Promise<void>
}