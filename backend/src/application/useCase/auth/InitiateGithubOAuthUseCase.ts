import { injectable } from "tsyringe";
import { IInitiateGithubOAuthUseCase } from "../interface/auth/IInitiateGithubOAuthUseCase";

@injectable()
export class InitiateGithubOAuthUseCase implements IInitiateGithubOAuthUseCase {
    execute(): string {
        const githubClientId = process.env.GITHUB_CLIENT_ID;
        const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
        
        if (!githubClientId) {
            throw new Error("GITHUB_CLIENT_ID is not configured");
        }

        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${backendUrl}/api/auth/github/callback&scope=user:email`;
        
        return githubAuthUrl;
    }
}
