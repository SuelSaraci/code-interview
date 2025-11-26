import { axiosInstance } from "./apiClient";
import type {
  CreateSubscriptionCheckoutResponse,
  GetSubscriptionStatusResponse,
} from "./types";

export async function createSubscriptionCheckout() {
  const res = await axiosInstance.post<CreateSubscriptionCheckoutResponse>(
    "/api/subscriptions/create"
  );
  return res.data;
}

export async function getSubscriptionStatus() {
  const res = await axiosInstance.get<GetSubscriptionStatusResponse>(
    "/api/subscriptions/status"
  );
  return res.data;
}


