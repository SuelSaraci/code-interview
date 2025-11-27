import { axiosInstance, getAuthHeaders } from "./apiClient";
import type {
  CreateSubscriptionCheckoutResponse,
  GetSubscriptionStatusResponse,
} from "./types";

export async function createSubscriptionCheckout() {
  const headers = await getAuthHeaders();
  const res = await axiosInstance.post<CreateSubscriptionCheckoutResponse>(
    "/api/subscriptions/create",
    null,
    { headers }
  );
  return res.data;
}

export async function getSubscriptionStatus() {
  const headers = await getAuthHeaders();
  const res = await axiosInstance.get<GetSubscriptionStatusResponse>(
    "/api/subscriptions/status",
    { headers }
  );
  return res.data;
}


