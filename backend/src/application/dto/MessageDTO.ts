export interface SendMessageDTO {
  roomId: string;
  senderId: string;
  content: string;
}

export interface SendMessageResponseDTO {
    id:string;
    roomId:string;
    senderId:string;
    senderName:string;
    avatarUrl?:string;
    content:string;
    createdAt:Date;
}