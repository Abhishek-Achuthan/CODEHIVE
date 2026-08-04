import { inject, injectable } from 'tsyringe';
import { ICreateSavedListUseCase } from '../interface/qna/ICreateSavedListUseCase';
import type { ISavedListRepository } from '../../../domain/interfaces/ISavedListRepository';
import { ConflictError } from '../../../core/errors/ConflictError';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

@injectable()
export class CreateSavedListUseCase implements ICreateSavedListUseCase {
  constructor(
    @inject('ISavedListRepository')
    private readonly _savedListRepository: ISavedListRepository
  ) {}

  async execute(userId: string, name: string): Promise<{ id: string; name: string }> {
    const existing = await this._savedListRepository.findByUserAndName(userId, name);

    if (existing) {
      throw new ConflictError(ERROR_MESSAGES.QnA.LIST_ALREADY_EXISTS);
    }

    const created = await this._savedListRepository.create({ userId, name });

    return { id: created.id, name: created.name };
  }
}
