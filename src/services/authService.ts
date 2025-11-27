import { axiosInstance, getAuthHeaders } from "./apiClient";
import type { VerifyAuthResponse } from "./types";

export async function verifyAuth() {
  const headers = await getAuthHeaders();
  const res = await axiosInstance.post<VerifyAuthResponse>("/api/auth/verify", null, {
    headers,
  });
  return res.data;
}


