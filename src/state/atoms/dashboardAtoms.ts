import { atom } from "recoil";
import type { DashboardData } from "../../services/types";

export const dashboardState = atom<DashboardData | null>({
  key: "dashboardState",
  default: null,
});


