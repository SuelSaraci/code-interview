import { axiosInstance, getAuthHeaders } from "./apiClient";
import type { GetDashboardResponse } from "./types";

export async function getDashboard() {
  const headers = await getAuthHeaders();
  const res = await axiosInstance.get<GetDashboardResponse>("/api/dashboard", {
    headers,
  });
  return res.data;
}


