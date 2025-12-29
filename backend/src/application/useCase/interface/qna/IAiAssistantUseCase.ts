import { AiAssistInputDTO, AiAssistOutputDTO } from '../../../dto/AiChatDTO';

export interface IAiAssistantUseCase {
    execute(data: AiAssistInputDTO): Promise<AiAssistOutputDTO>;
}