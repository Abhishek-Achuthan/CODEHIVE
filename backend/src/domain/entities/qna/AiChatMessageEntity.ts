export interface AiChatMessageEntity {
    id:string,
    sessionId:string,
    role:'user' |'assistant',
    content:string,
    createdAt:Date,
}