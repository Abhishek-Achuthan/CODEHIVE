export interface MessageEntity {
    id: string;
    roomId: string;
    senderId: string;
    parentMessageId?: string;
    content: string;
    isDeleted?: boolean;
    createdAt: Date;
    updatedAt: Date;
}