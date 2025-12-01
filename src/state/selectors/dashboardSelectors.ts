import { selectorFamily } from "recoil";
import { getDashboard } from "../../services/dashboardService";
import { dashboardState } from "../atoms/dashboardAtoms";
import type { DashboardData } from "../../services/types";

export const dashboardSelector = selectorFamily<DashboardData | null, boolean>({
  key: "dashboardSelector",
  get: (enabled: boolean) => async () => {
    if (!enabled) {
      return null;
    }
    try {
      const res = await getDashboard();
      return res.dashboard;
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      return null;
    }
  },
});
