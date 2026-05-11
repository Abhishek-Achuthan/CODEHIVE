export interface ICreatePollInputDTO {
    question: string;
    options: {
        text: string;
    }[];
    allowMultiple?: boolean;
    expiresAt?: Date;
    createdBy: string;
    roomId: string;
}

export interface ICreatePollOutputDTO {
    id: string;
    question: string;
    createdBy : string
    roomId : string;
    options: {
        text: string;
        votes: string[];
    }[];
    allowMultiple?: boolean;
    expiresAt?: Date | null;
    createdAt: Date;
    updatedAt?: Date;
}