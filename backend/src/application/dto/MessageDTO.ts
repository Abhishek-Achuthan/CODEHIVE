export interface SendMessageDTO {
  roomId: string;
  senderId: string;
  parentMessageId?: string;
  content: string;
}

export interface SendMessageResponseDTO {
    id:string;
    roomId:string;
    senderId:string;
    senderName:string;
    avatarUrl?:string;
    parentMessageId?: string;
    content:string;
    createdAt:Date;
}