import { inject, injectable } from 'tsyringe';
import { IEditQuestionUseCase } from '../interface/qna/IEditQuestionUseCase';
import type { IQuestionRepository } from '../../../domain/interfaces/IQuestionRepository';
import { QuestionEntity } from '../../../domain/entities/qna/QuestionEntity';
import { EditQuestionInputDTO } from '../../dto/QuestionDTO';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ConflictError } from '../../../core/errors/ConflictError';
import { QuestionEditableFields } from '../../../domain/types/QuestionEditableFields';
import { ForbiddenError } from '../../../core/errors/ForbiddenError';

@injectable()
export class EditQuestionUseCase implements IEditQuestionUseCase {
  constructor(
    @inject('IQuestionRepository')
    private readonly _questionRepository: IQuestionRepository
  ) {}

  async execute(
    data: EditQuestionInputDTO,
    questionId: string,
    userId: string
  ): Promise<QuestionEntity | null> {
    const { title, version, descriptionHtml, tags } = data;

    const question = await this._questionRepository.find(questionId);

    const q = question;

    if (!q) throw new NotFoundError(ERROR_MESSAGES.QnA.NOT_FOUND);

    if (q.version !== version) throw new ConflictError();

    if(q.askedBy !== userId) throw new ForbiddenError(ERROR_MESSAGES.QnA.NOT_ALLOWED_TO_EDIT_QUESTION);

    const updateData: QuestionEditableFields = {};

    if (title !== undefined) updateData.title = title;

    if (descriptionHtml !== undefined)
      updateData.descriptionHtml = descriptionHtml;
    if (tags !== undefined) updateData.tags = tags;

    updateData.lastEditedBy = userId;

    const updated = await this._questionRepository.updateWithVersion(
      questionId,
      version,
      updateData
    );

    if (!updated) throw new ConflictError();
    return updated;
  }
}
