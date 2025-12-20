import { inject, injectable } from 'tsyringe';
import { ICreateSavedListUseCase } from '../interface/qna/ICreateSavedListUseCase';
import type { ISavedListRepository } from '../../../domain/interfaces/ISavedListRepository';
import { ConflictError } from '../../../core/errors/ConflictError';

@injectable()
export class CreateSavedListUseCase implements ICreateSavedListUseCase {
  constructor(
    @inject('ISavedListRepository')
    private readonly _savedListRepository: ISavedListRepository
  ) {}

  async execute(userId: string, name: string): Promise<{ id: string; name: string }> {
    const trimmed = name.trim();

    if (!trimmed) {
      throw new ConflictError('List name is required');
    }

    const existing = await this._savedListRepository.findByUserAndName(userId, trimmed);

    if (existing) {
      throw new ConflictError('List already exists');
    }

    const created = await this._savedListRepository.create({ userId, name: trimmed });

    return { id: created.id, name: created.name };
  }
}
