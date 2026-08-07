import { GenericRepository } from './GenericRepository';
import { CommentDoc } from '../schemas/qna/CommentSchema';
import { CommentEntity } from '../../../domain/entities/qna/CommentEntity';
import { ICommentRepository, CommentWithAuthor } from '../../../domain/interfaces/ICommentRepository';
import CommentModel from '../models/qna/CommentModel';
import { Model, Types } from 'mongoose';
import { UserLeanDoc } from '../schemas/UserSchema';

type PopulatedCommentAuthor = Pick<
  UserLeanDoc,
  '_id' | 'firstName' | 'lastName' | 'avatarUrl'
> & {
  username?: string;
  reputation?: number;
  profileImage?: string;
};

type CommentWithPopulatedAuthorDoc = Omit<CommentDoc, 'authorId'> & {
  authorId: PopulatedCommentAuthor;
};

export class CommentRepository
  extends GenericRepository<CommentDoc, CommentEntity>
  implements ICommentRepository
{
  constructor() {
    super(CommentModel as Model<CommentDoc>);
  }

  protected toDocument(data: Partial<CommentEntity>): Partial<CommentDoc> {
    const doc: Partial<CommentDoc> = {};
    if (data.answerId !== undefined) doc.answerId = new Types.ObjectId(data.answerId);
    if (data.authorId !== undefined) doc.authorId = new Types.ObjectId(data.authorId);
    if (data.content !== undefined) doc.content = data.content;
    return doc;
  }

  protected toEntity(doc: CommentDoc): CommentEntity {
    return {
      id: doc._id.toString(),
      answerId: doc.answerId.toString(),
      authorId: doc.authorId.toString(),
      content: doc.content,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async listByAnswer(answerId: string): Promise<CommentWithAuthor[]> {
    const docs = await this._model
      .find({ answerId: new Types.ObjectId(answerId) })
      .populate<{ authorId: PopulatedCommentAuthor }>({
        path: 'authorId',
        select: 'username firstName lastName profileImage reputation',
      })
      .sort({ createdAt: 1 })
      .lean<CommentWithPopulatedAuthorDoc[]>();

    return docs.map((doc) => ({
      id: doc._id.toString(),
      answerId: doc.answerId.toString(),
      content: doc.content,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      author: {
        id: doc.authorId._id.toString(),
        username: doc.authorId.username || '',
        firstName: doc.authorId.firstName,
        lastName: doc.authorId.lastName,
        ...(doc.authorId.profileImage !== undefined ? { profileImage: doc.authorId.profileImage } : {}),
        reputation: doc.authorId.reputation || 0,
      },
    }));
  }
}
