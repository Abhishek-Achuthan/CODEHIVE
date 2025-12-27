import { inject, injectable } from 'tsyringe';
import { IEditAnswerUseCase } from '../interface/qna/IEditAnswerUseCase';
import type { IAnswerRepository } from '../../../domain/interfaces/IAnswerRepository';
import { IAnswerResponseDTO, IEditAnswerInputDTO } from '../../dto/AnswerDTO';
import { ConflictError } from '../../../core/errors/ConflictError';
import { ForbiddenError } from '../../../core/errors/ForbiddenError';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { AnswerEditableFields } from '../../../domain/types/AnswerEditableFields';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { AnswerMapper } from '../../mapper/AnswerMapper';

@injectable()
export class EditAnswerUseCase implements IEditAnswerUseCase {
  constructor(
    @inject('IAnswerRepository')
    private readonly _answerRepository: IAnswerRepository
  ) {}

  async execute(data: IEditAnswerInputDTO): Promise<IAnswerResponseDTO | null> {
    const { answerId, answerText, userId, version } = data;

    if (!answerId) throw new NotFoundError(ERROR_MESSAGES.QnA.ANSWER_NOT_FOUND);

    const answer = await this._answerRepository.find(answerId);

    if(!answer) throw new NotFoundError(ERROR_MESSAGES.QnA.ANSWER_NOT_FOUND);

    if (version !== answer.version) throw new ConflictError(ERROR_MESSAGES.QnA.ANSWER_VERSION_CONFLICT)

    if (userId !== answer.answeredBy) throw new ForbiddenError(ERROR_MESSAGES.QnA.NOT_ALLOWED_TO_EDIT_ANSWER)

    const updateFields: AnswerEditableFields = {
      lastEditedBy: userId,
      answerText,
    };

    const updateAns = await this._answerRepository.updateWithVersion(
      answerId,
      version,
      updateFields
    );

    if (!updateAns) throw new ConflictError(ERROR_MESSAGES.QnA.ANSWER_VERSION_CONFLICT);

    return AnswerMapper.toAnswerResponse(updateAns);
  }
}
