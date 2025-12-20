import { inject, injectable } from 'tsyringe';

import { IRecordQuestionViewUseCase } from '../interface/qna/IRecordQuestionViewUseCase';
import type { IQuestionViewRepository } from '../../../domain/interfaces/IQuestionViewRepository';
import type { IQuestionRepository } from '../../../domain/interfaces/IQuestionRepository';

@injectable()
export class RecordQuestionViewUseCase implements IRecordQuestionViewUseCase {
  constructor(
    @inject('IQuestionViewRepository')
    private readonly _questionViewRepository: IQuestionViewRepository,
    @inject('IQuestionRepository')
    private readonly _questionRepository: IQuestionRepository
  ) {}

  async execute(questionId: string, userId: string): Promise<boolean> {
    const isFirstView = await this._questionViewRepository.createIfNotExists(
      userId,
      questionId
    );

    if (!isFirstView) return false;

    await this._questionRepository.incrementViews(questionId, 1);

    return true;
  }
}
