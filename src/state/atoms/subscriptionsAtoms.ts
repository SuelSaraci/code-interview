import { atom } from "recoil";
import type { GetSubscriptionStatusResponse } from "../../services/types";

export const subscriptionStatusState = atom<GetSubscriptionStatusResponse | null>({
  key: "subscriptionStatusState",
  default: null,
});


