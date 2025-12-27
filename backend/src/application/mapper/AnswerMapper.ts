import { AnswerEntity } from '../../domain/entities/qna/AnswerEntity';
import { AnswerWithAuthor } from '../../domain/types/AnswerWithAuthor';
import {
  AnswerWithAuthorDTO,
  IAnswerResponseDTO,
  IGetAnswerResponseDTO,
} from '../dto/AnswerDTO';

export class AnswerMapper {
  public static toGetAnswerResponse(answer: AnswerEntity): IGetAnswerResponseDTO {
    return {
      id: answer.id,
      answerText: answer.answerText,
      authorId: answer.answeredBy,
      questionId: answer.questionId,
      version: answer.version,
    };
  }

  public static toAnswerResponse(answer: AnswerEntity): IAnswerResponseDTO {
    return {
      id: answer.id,
      questionId: answer.questionId,
      answeredBy: answer.answeredBy,
      answerText: answer.answerText,
      voteCount: answer.voteCount,
      isAccepted: answer.isAccepted,
      version: answer.version,
      createdAt: new Date(answer.createdAt).toISOString(),
      updatedAt: new Date(answer.updatedAt).toISOString(),
      ...(answer.lastEditedAt ? { lastEditedAt: answer.lastEditedAt } : {}),
      ...(answer.lastEditedBy !== undefined
        ? { lastEditedBy: answer.lastEditedBy }
        : {}),
      ...(answer.editCount !== undefined ? { editCount: answer.editCount } : {}),
    };
  }

  public static toAnswerWithAuthor(
    answerWithAuthor: AnswerWithAuthor
  ): AnswerWithAuthorDTO {
    return {
      answer: this.toAnswerResponse(answerWithAuthor.answer),
      author: answerWithAuthor.author,
    };
  }
}
