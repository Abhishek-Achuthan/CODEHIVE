export interface AiAssistInputDTO {
  userId: string;
  prompt: string;
  sessionId?: string;
}

export interface AiAssistOutputDTO {
  sessionId: string;
  response: string;
}
