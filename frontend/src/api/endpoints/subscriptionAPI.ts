import { API_ROUTES } from "../../constants/apiRoutes";
import apiClient from "../apiClient";
import type { CreateSubscriptionCheckoutPayload } from "../../shared/types/api/subscription";

export const createCheckoutSession = (payload: CreateSubscriptionCheckoutPayload) =>
  apiClient.post(API_ROUTES.SUBSCRIPTIONS.CHECKOUT, payload);

export const getMySubscription = () => apiClient.get(API_ROUTES.SUBSCRIPTIONS.ME);
