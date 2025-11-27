import { IQuestionRepository } from '../../../domain/interfaces/IQuestionRepository';
import { GenericRepository } from './GenericRepository';
import { QuestionEntity } from '../../../domain/entities/qna/QuestionEntity';
import QuestionModel from '../models/qna/QuestionModel';
import { QuestionDoc } from '../schemas/qna/QuestionSchema';
import { FilterQuery, Model, SortOrder, Types } from 'mongoose';
import { PaginationResult } from '../../../domain/types/PaginationResult';
import { IQuestionListQueryDTO } from '../../../application/dto/QuestionDTO';
import { QuestionStatus } from '../../../domain/types/QuestionStatus';
import { QuestionSort } from '../../../domain/types/QuestionSort';

export class QuestionRepository
  extends GenericRepository<QuestionDoc, QuestionEntity>
  implements IQuestionRepository
{
  constructor() {
    super(QuestionModel as Model<QuestionDoc>);
  }

  async findByAuthorId(
    authorId: string
  ): Promise<PaginationResult<QuestionEntity>> {
    const query: FilterQuery<QuestionDoc> = { askedBy: authorId };
    const questionDocs = await this._model.find(query).lean<QuestionDoc[]>();
    const questions = questionDocs.map((doc) =>
      this.toEntity(doc as QuestionDoc)
    );

    return { items: questions, totalItems: questions.length, totalPages: 1 };
}

async list(data: IQuestionListQueryDTO): Promise<PaginationResult<QuestionEntity>> {
  const {
    filter,
    limit = 10,
    page = 1,
    sortBy,
    search,
  } = data || {};
    
  const query:FilterQuery<QuestionDoc> = {};
  
  const tags: string[] = [];
  if(filter?.tags?.length) tags.push(...filter.tags);
  if(tags.length) query.tags = {$in:tags};
  
  if(filter?.status === QuestionStatus.ANSWERED) query.isAnswered = true;
  if(filter?.status === QuestionStatus.UNANSWERED) query.isAnswered = false;

  if(filter?.dateFrom) {
    query.createdAt = {};
    if(filter.dateFrom) query.createdAt.$gte = new Date(filter.dateFrom);
  }
  
  if(filter?.minAnswers !== undefined) query.answerCount = {$gte :filter?.minAnswers};
  if(filter?.minVotes !== undefined) query.votes = {$gte :filter?.minVotes};
  
  if(search) {
    const raw = search.trim();
    if(raw.length > 0)  {
      const escaped = raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(escaped,'i');
      query.$or = [
        {title:re},
        {description:re}
      ]
    }
  }
  
  const sort = this.mapSort(sortBy);
  
  const pageLimit = Math.max(1,Math.min(100,limit));
  const currentPage = Math.max(1,page);
  const skip = (currentPage-1) * limit;
  
  const [docs,totalItems] = await Promise.all([
    this._model.find(query).sort(sort).skip(skip).limit(pageLimit).lean<QuestionDoc[]>(),
    this._model.countDocuments(query)
  ]);
  
  const items = docs.map((d) => this.toEntity(d as QuestionDoc))
  const totalPages = limit?Math.max(1,Math.ceil(totalItems/limit)):1;
  
  return {items,totalItems,totalPages}
  
}
    protected toDocument(data: Partial<QuestionEntity>): Partial<QuestionDoc> {
        const {
            title,
            descriptionHtml,
            askedBy,
            tags,
            answerCount,
            votes,
            isAnswered,
            views
        } = data;
            const doc : Partial<QuestionDoc> = {}
             if (title !== undefined) doc.title = title;
             if(descriptionHtml !==undefined) doc.descriptionHtml = descriptionHtml;
             if(askedBy !==undefined) doc.askedBy = new Types.ObjectId(askedBy);
             if(tags !== undefined) doc.tags = tags;
             if(answerCount !== undefined) doc.answerCount = answerCount;
             if(votes !== undefined) doc.votes = votes;
             if(isAnswered !== undefined) doc.isAnswered = isAnswered;
             if(views !== undefined) doc.views = views;

             return doc;
    }

    protected toEntity(doc: QuestionDoc): QuestionEntity {
        return {
            title:doc.title,
            descriptionHtml:doc.descriptionHtml,
            askedBy: doc.askedBy.toString(),
            tags: doc.tags,
            answerCount: doc.answerCount,
            votes:doc.votes,
            isAnswered: doc.isAnswered,
            views: doc.views,
            id: doc._id.toString(),    
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        }
    }

    private mapSort(sortBy?:QuestionSort): {[key:string] : SortOrder} {
      switch(sortBy) {
        case QuestionSort.MostAnswered:
          return {answerCount:-1};
        case QuestionSort.LeastAnswered:
          return {answerCount:1};
        case QuestionSort.Oldest:
          return {createdAt:1};
        case QuestionSort.Newest:
          return {createdAt:-1};
        case QuestionSort.MostVoted:
          return {votes:-1};
        case QuestionSort.MostViewed:
          return {views:-1}
        default:
          return {createdAt:-1};
      }
    }
            
}