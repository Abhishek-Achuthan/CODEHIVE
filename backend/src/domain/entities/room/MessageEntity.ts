export interface MessageEntity {
    id: string;
    roomId:string;
    senderId:string;
    content:string;
    createdAt:Date;
    updatedAt:Date;
}