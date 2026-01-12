export interface ICancelSessionUseCase {
    execute(sessionId:string,userId:string) :Promise<boolean>;
}