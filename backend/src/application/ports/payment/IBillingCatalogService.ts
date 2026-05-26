import {
  BillingCatalogSnapshot,
  CreateBillingPriceInput,
  CreateBillingPriceResult,
  CreateBillingProductInput,
  CreateBillingProductResult,
  UpdateBillingProductInput,
} from '../../../domain/types/BillingCatalogTypes';

export interface IBillingCatalogService {
  createBillingProduct(
    input: CreateBillingProductInput,
  ): Promise<CreateBillingProductResult>;

  updateBillingProduct(
    productId: string,
    input: UpdateBillingProductInput,
  ): Promise<void>;

  createBillingPrice(
    input: CreateBillingPriceInput,
  ): Promise<CreateBillingPriceResult>;

  archiveBillingPrice(priceId: string): Promise<void>;

  archiveBillingCatalog(catalog: BillingCatalogSnapshot): Promise<void>;
}
