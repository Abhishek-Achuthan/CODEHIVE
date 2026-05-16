import { WhiteboardType } from "../../types/WhiteboardType";

export interface WhiteboardEntity {
    id: string;
    roomId: string;
    createdBy: string;
    type:WhiteboardType
    x:number;
    y:number;

    width?:number;
    height?:number;
    points?:number[];
    text?:string;
    strokeColor:string;
    fillColor:string;
    strokeWidth:number;
    createdAt:Date;
    updatedAt:Date;
    
}