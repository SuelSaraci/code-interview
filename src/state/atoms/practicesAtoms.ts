import { atom } from "recoil";
import type { GetPracticesResponse } from "../../services/types";

export const practicesListState = atom<GetPracticesResponse | null>({
  key: "practicesListState",
  default: null,
});


