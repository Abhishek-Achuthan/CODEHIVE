import { GenerateContentResponse, GoogleGenAI } from '@google/genai';
import { IAIService } from '../../../application/ports/ai/IAIService';
import { env } from '../../../config/envConfig';

export class AIService implements IAIService {
    private readonly _ai : GoogleGenAI;
    private readonly _model:string;

    constructor(
        aiModel = env.aiModel,apiKey = env.aiApiKey!
    ) {
        this._ai = new GoogleGenAI({apiKey});
        this._model = aiModel
    };

    async genarateContent(prompt: string): Promise<GenerateContentResponse> {
        return this._ai.models.generateContent({
            model:this._model,
            contents:prompt
        });
    };
};