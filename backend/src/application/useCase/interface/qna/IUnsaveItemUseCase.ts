export interface IUnsaveItemUseCase {
    execute(questionId:string,userId:string):Promise<boolean>
}