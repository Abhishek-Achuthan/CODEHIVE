import { injectable, inject } from 'tsyringe';
import type { ICommentRepository, CommentWithAuthor } from '../../../domain/interfaces/ICommentRepository';

@injectable()
export class GetCommentsUseCase {
  constructor(@inject('ICommentRepository') private commentRepository: ICommentRepository) {}

  async execute(answerId: string): Promise<CommentWithAuthor[]> {
    return await this.commentRepository.listByAnswer(answerId);
  }
}
