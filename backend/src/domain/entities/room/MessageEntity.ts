export interface MessageEntity {
    id: string;
    roomId: string;
    senderId: string;
    parentMessageId?: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}