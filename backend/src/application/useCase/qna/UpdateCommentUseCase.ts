import { injectable, inject } from 'tsyringe';
import type { ICommentRepository } from '../../../domain/interfaces/ICommentRepository';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { ForbiddenError } from '../../../core/errors/ForbiddenError';

@injectable()
export class UpdateCommentUseCase {
  constructor(@inject('ICommentRepository') private commentRepository: ICommentRepository) {}

  async execute(commentId: string, authorId: string, content: string) {
    const comment = await this.commentRepository.find(commentId);
    if (!comment) throw new NotFoundError('Comment not found');

    if (comment.authorId !== authorId) {
      throw new ForbiddenError('You can only edit your own comments');
    }

    const updated = await this.commentRepository.update(commentId, { content });
    return updated;
  }
}
