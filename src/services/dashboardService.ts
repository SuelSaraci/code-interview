import { axiosInstance } from "./apiClient";
import type { GetDashboardResponse } from "./types";

export async function getDashboard() {
  const res = await axiosInstance.get<GetDashboardResponse>("/api/dashboard");
  return res.data;
}


