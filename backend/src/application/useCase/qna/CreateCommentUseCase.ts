import { injectable, inject } from 'tsyringe';
import type { ICommentRepository } from '../../../domain/interfaces/ICommentRepository';
import type { IAnswerRepository } from '../../../domain/interfaces/IAnswerRepository';
import type { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import type { INotificationService } from '../../ports/notifications/INotificationService';
import { NotFoundError } from '../../../core/errors/NotFoundError';

@injectable()
export class CreateCommentUseCase {
  constructor(
    @inject('ICommentRepository') private commentRepository: ICommentRepository,
    @inject('IAnswerRepository') private answerRepository: IAnswerRepository,
    @inject('IUserRepository') private userRepository: IUserRepository,
    @inject('INotificationService') private notificationService: INotificationService
  ) {}

  async execute(answerId: string, authorId: string, content: string) {
    const answer = await this.answerRepository.find(answerId);
    if (!answer) throw new NotFoundError('Answer not found');

    const comment = await this.commentRepository.create({
      answerId,
      authorId,
      content,
    });

    const author = await this.userRepository.find(authorId);

    if (answer.answeredBy !== authorId && author) {
      await this.notificationService.notify({
        recipientId: answer.answeredBy,
        type: 'INFO',
        category: 'QNA',
        title: 'New Comment on your Answer',
        message: `${author.firstName} commented on your answer.`,
        actionUrl: `/qna/question/${answer.questionId}`,
      });
    }

    return {
      ...comment,
      author: author ? {
        id: author.id,
        username: author.firstName,
        firstName: author.firstName,
        lastName: author.lastName,
        profileImage: author.avatarUrl,
        reputation: 0,
      } : {
        id: authorId,
        username: 'Unknown',
        firstName: 'Unknown',
        lastName: '',
        profileImage: '',
        reputation: 0,
      }
    };
  }
}
