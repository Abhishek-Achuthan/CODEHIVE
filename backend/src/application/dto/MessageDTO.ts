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


export interface DeleteMessageDTO {
  messageId: string;
  userId: string;
}

export interface DeleteMessageResultDTO {
  roomId: string;
  messageId: string;
}

export interface EditMessageDTO {
  messageId: string;
  senderId: string;
  content: string;
}

export interface EditMessageResultDTO {
  roomId: string;
  messageId: string;
  content: string;
}
