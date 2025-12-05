import { selectorFamily } from "recoil";
import {
  getPractices,
  getPracticeById,
} from "../../services/practicesService";
import type {
  GetPracticesQuery,
  GetPracticesResponse,
  PracticeDetail,
} from "../../services/types";
import { practicesRefreshKeyState } from "../atoms/practicesAtoms";

export const practicesQuerySelector = selectorFamily<
  GetPracticesResponse | null,
  { query?: GetPracticesQuery; enabled: boolean }
>({
  key: "practicesQuerySelector",
  get:
    (params) =>
    async ({ get }) => {
      if (!params.enabled) {
        return null;
      }
      // Depend on global refresh key so refetches occur when it changes
      get(practicesRefreshKeyState);
      const res = await getPractices(params.query);
      return res;
    },
});

// Fetch a single practice by id, but only when explicitly enabled.
export const practiceByIdSelector = selectorFamily<
  PracticeDetail | null,
  { id: number; enabled: boolean }
>({
  key: "practiceByIdSelector",
  get:
    (params) =>
    async ({ get }) => {
      if (!params.enabled || !params.id) {
        return null;
      }
      // Depend on global refresh key so refetches occur when it changes
      get(practicesRefreshKeyState);
      const res = await getPracticeById(params.id);
      return res.practice;
    },
});


