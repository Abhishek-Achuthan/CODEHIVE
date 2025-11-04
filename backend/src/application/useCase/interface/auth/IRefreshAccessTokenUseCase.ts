export interface IRefreshAccessTokenUseCase {
    execute(refreshToken: string): Promise<string>;
}



