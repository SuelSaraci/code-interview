import { selectorFamily } from "recoil";
import { getDashboard } from "../../services/dashboardService";
import { dashboardState } from "../atoms/dashboardAtoms";

export const dashboardSelector = selectorFamily({
  key: "dashboardSelector",
  get:
    (enabled: boolean) =>
    async ({ set }) => {
      if (!enabled) {
        return null;
      }
      const res = await getDashboard();
      set(dashboardState, res.dashboard);
      return res.dashboard;
    },
});

