import { SubscriptionEntity } from "../entities/SubscriptionEntity";
import { IGenericRepository } from "./IGenericRepository";

export interface ISubscriptionRepository extends IGenericRepository<SubscriptionEntity> {
    findActiveByUserId(userId:string):Promise<SubscriptionEntity | null> 
}   