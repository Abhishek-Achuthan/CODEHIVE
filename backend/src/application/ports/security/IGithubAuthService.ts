export interface IGithubAuthService {
    getUserFromCode(code: string): Promise<{
        email:string,
        name:string,
        githubId:string;
    }>
}