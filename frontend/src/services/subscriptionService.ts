import toast from "react-hot-toast";
import { AxiosError } from "axios";
import * as SubscriptionApi from "../api/endpoints/subscriptionAPI";
import type {
  CreateSubscriptionCheckoutPayload,
  CurrentSubscription,
  SubscriptionCheckoutSessionResponse,
} from "../shared/types/api/subscription";

export class SubscriptionService {
  static async getMySubscription(): Promise<CurrentSubscription | null> {
    try {
      const response = await SubscriptionApi.getMySubscription();
      const data = response.data;
      return data ?? null;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return null;
      }
      this.handleError(error);
      throw error;
    }
  }

  static async createCheckoutSession(
    payload: CreateSubscriptionCheckoutPayload,
  ): Promise<SubscriptionCheckoutSessionResponse> {
    try {
      const response = await SubscriptionApi.createCheckoutSession(payload);
      return response.data as SubscriptionCheckoutSessionResponse;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private static handleError(error: unknown) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } else if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Unexpected error");
    }
  }
}
