import { GenerateContentResponse, GoogleGenAI } from '@google/genai';
import { IAIService } from '../../../application/ports/ai/IAIService';
import { env } from '../../../config/envConfig';

export class AIService implements IAIService {
  private _aiInstance: GoogleGenAI | null = null;

  private get _ai(): GoogleGenAI {
    if (!this._aiInstance) {
      this._aiInstance = new GoogleGenAI({ apiKey: env.aiApiKey || '' });
    }
    return this._aiInstance;
  }

  private get _model(): string {
    return env.aiModel;
  }

  async genarateContent(prompt: string): Promise<GenerateContentResponse> {
    return this._ai.models.generateContent({
      model: this._model,
      contents: prompt,
    });
  }
}
