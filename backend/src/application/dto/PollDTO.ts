import { PollEntity } from "../../domain/entities/room/PollEntity";

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

export interface IClosePollInputDTO {
    roomId: string;
    pollId: string;
    userId: string;
}

export interface IClosePollOutputDTO extends PollEntity {}