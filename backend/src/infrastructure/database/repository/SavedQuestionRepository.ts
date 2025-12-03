import { SavedQuestionDoc } from '../schemas/qna/SavedQuestionSchema';
import { ISavedQuestionRepository } from '../../../domain/interfaces/ISavedQuestionRepository';
import { GenericRepository } from './GenericRepository';
import { Model, Types } from 'mongoose';
import SavedQuestionModel from '../models/qna/SavedQuestionModel';
import { SavedQuestionEntity } from '../../../domain/entities/qna/SavedQuestionEntity';


export class SavedQuestionRepository extends GenericRepository<SavedQuestionDoc,SavedQuestionEntity> implements ISavedQuestionRepository {
    constructor () {
        super(SavedQuestionModel as Model<SavedQuestionDoc>)
    }

    protected toEntity(doc: SavedQuestionDoc): SavedQuestionEntity {
        return {
            id: doc._id.toString(),
            userId: doc.userId.toString(),
            questionId: doc.questionId.toString(),
            createdAt:doc.createdAt.toISOString(),
            updatedAt:doc.createdAt.toISOString(),
        }
    }

    protected toDocument(data: Partial<SavedQuestionEntity>): Partial<SavedQuestionDoc> {
        const doc: Partial<SavedQuestionDoc> = {};

        if(data.userId !== undefined) doc.userId = new Types.ObjectId(data.userId)
        if(data.questionId !== undefined) doc.questionId = new Types.ObjectId(data.questionId)
        
        return doc
    }
}