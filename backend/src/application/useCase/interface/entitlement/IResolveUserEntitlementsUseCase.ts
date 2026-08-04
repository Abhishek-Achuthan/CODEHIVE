import { ResolveUserEntitlementsResponseDTO } from '../../../dto/PlanDTO';

export interface IResolveUserEntitlementsUseCase {
    execute(userId:string): Promise<ResolveUserEntitlementsResponseDTO>;
}