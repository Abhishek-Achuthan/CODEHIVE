import { UserEntity } from '../../../../domain/entities/UserEntity';

export interface IApplyForMentorUseCase {
    execute(userId: string): Promise<UserEntity>
}