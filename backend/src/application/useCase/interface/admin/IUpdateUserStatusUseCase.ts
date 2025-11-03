export interface IUpdateUserStatusUseCase {
    execute(id:string,isBlocked:boolean):Promise<void>
}