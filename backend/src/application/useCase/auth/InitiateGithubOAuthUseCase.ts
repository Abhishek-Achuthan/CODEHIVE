import { injectable } from 'tsyringe';
import { IInitiateGithubOAuthUseCase } from '../interface/auth/IInitiateGithubOAuthUseCase';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

@injectable()
export class InitiateGithubOAuthUseCase implements IInitiateGithubOAuthUseCase {
    execute(): string {
        const githubClientId = process.env.GITHUB_CLIENT_ID;
        const backendUrl = process.env.BACKEND_URL 
        
        if (!githubClientId) {
            throw new Error(ERROR_MESSAGES.GITHUB.MISSING_ENV);
        }

        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${backendUrl}/api/auth/github/callback&scope=user:email`;
        
        return githubAuthUrl;
    }
}
