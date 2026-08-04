import { QuestionEntity } from '../../domain/entities/qna/QuestionEntity';
import { QuestionWithAuthor } from '../../domain/types/QuestionWithAuthor';
import { IQuestionResponseDTO, QuestionWithAuthorDTO } from '../dto/QuestionDTO';

export class QuestionMapper {
    public static toQuestionResponse(question: QuestionEntity): IQuestionResponseDTO {
        return {
            id: question.id,
            title: question.title,
            descriptionHtml: question.descriptionHtml,
            askedBy: question.askedBy,
            answerCount: question.answerCount,
            isAnswered: question.isAnswered,
            tags: question.tags,
            views: question.views,
            votes: question.votes,
            acceptedAnswerId: question.acceptedAnswerId,
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
            lastEditedAt: question.lastEditedAt,
            lastEditedBy: question.lastEditedBy,
            editCount: question.editCount,
            version: question.version,
        };
    }

    public static toQuestionWithAuthor(
        questionData: QuestionWithAuthor,
        isBookmarked: boolean
    ): QuestionWithAuthorDTO {
        return {
            question: this.toQuestionResponse(questionData.question),
            author: questionData.author,
            isBookmarked,
        };
    }
}