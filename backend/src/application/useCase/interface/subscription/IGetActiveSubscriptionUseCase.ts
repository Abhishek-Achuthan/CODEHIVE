import { SubscriptionResponseDTO } from "../../../dto/subscriptionDTO";

export interface IGetActiveSubscriptionUseCase {
    execute(userId:string):Promise<SubscriptionResponseDTO | null>
}