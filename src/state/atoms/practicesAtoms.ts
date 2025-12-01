import { atom } from "recoil";
import type { GetPracticesResponse } from "../../services/types";

export const practicesListState = atom<GetPracticesResponse | null>({
  key: "practicesListState",
  default: null,
});

// Global refresh key so any component can trigger a refetch of practices
export const practicesRefreshKeyState = atom<number>({
  key: "practicesRefreshKeyState",
  default: 0,
});

