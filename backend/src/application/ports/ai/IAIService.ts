import {GenerateContentResponse} from '@google/genai'

export interface IAIService {
    genarateContent(prompt:string):Promise<GenerateContentResponse>
}