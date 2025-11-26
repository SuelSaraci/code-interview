import { axiosInstance } from "./apiClient";
import type { VerifyAuthResponse } from "./types";

export async function verifyAuth() {
  const res = await axiosInstance.post<VerifyAuthResponse>("/api/auth/verify");
  return res.data;
}


