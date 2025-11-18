import { inject, injectable } from 'tsyringe';
import { ICreateQuestionUseCase } from '../interface/qna/ICreateQuestionUseCase';
import { ICreateQuestionInputDTO } from '../../dto/QuestionDTO';
import type { IQuestionRepository } from '../../../domain/interfaces/IQuestionRepository';

@injectable()
export class CreateQuestionUseCase implements ICreateQuestionUseCase {
  constructor(
    @inject('IQuestionRepository')
    private readonly _questionRepository: IQuestionRepository
  ) {}
  async execute(input: ICreateQuestionInputDTO): Promise<void> {
    await this._questionRepository.create({
      title: input.title,
      description: input.description,
      askedBy: input.askedBy,
      tags: input.tags,
      answerCount: 0,
      views: 0,
      votes: 0,
      isAnswered: false,
    });
  }
}
