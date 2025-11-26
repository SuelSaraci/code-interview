import { selector } from "recoil";
import { getSubscriptionStatus } from "../../services/subscriptionsService";
import { subscriptionStatusState } from "../atoms/subscriptionsAtoms";

export const subscriptionStatusSelector = selector({
  key: "subscriptionStatusSelector",
  get: async ({ set }) => {
    const res = await getSubscriptionStatus();
    set(subscriptionStatusState, res);
    return res;
  },
});


