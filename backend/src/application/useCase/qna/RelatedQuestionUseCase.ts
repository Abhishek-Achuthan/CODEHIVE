import { inject, injectable } from 'tsyringe';
import { IRelatedQuestionUseCase } from '../interface/qna/IRelatedQuestionUseCase';
import type { IQuestionRepository } from '../../../domain/interfaces/IQuestionRepository';
import { QuestionEntity } from '../../../domain/entities/qna/QuestionEntity';

@injectable()
export class RelatedQuestionUseCase implements IRelatedQuestionUseCase {
  constructor(
    @inject('IQuestionRepository')
    private readonly _questionRepository: IQuestionRepository
  ) {}

  async execute(questionId: string): Promise<QuestionEntity[]> {
    return await this._questionRepository.relatedQuestions(questionId);
  }
}
