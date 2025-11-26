import { selector } from "recoil";
import { getDashboard } from "../../services/dashboardService";
import { dashboardState } from "../atoms/dashboardAtoms";

export const dashboardSelector = selector({
  key: "dashboardSelector",
  get: async ({ set }) => {
    const res = await getDashboard();
    set(dashboardState, res.dashboard);
    return res.dashboard;
  },
});


