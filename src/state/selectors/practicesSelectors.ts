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

export const practicesQuerySelector = selectorFamily<
  GetPracticesResponse | null,
  { query?: GetPracticesQuery; enabled: boolean }
>({
  key: "practicesQuerySelector",
  get:
    (params) =>
    async () => {
      if (!params.enabled) {
        return null;
      }
      const res = await getPractices(params.query);
      return res;
    },
});

export const practiceByIdSelector = selectorFamily<PracticeDetail | null, number>({
  key: "practiceByIdSelector",
  get: (id: number) => async () => {
    const res = await getPracticeById(id);
    return res.practice;
  },
});


