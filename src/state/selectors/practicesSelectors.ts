import { selectorFamily } from "recoil";
import {
  getPractices,
  getPracticeById,
} from "../../services/practicesService";
import { practicesListState } from "../atoms/practicesAtoms";
import type {
  GetPracticesQuery,
  PracticeDetail,
} from "../../services/types";

export const practicesQuerySelector = selectorFamily({
  key: "practicesQuerySelector",
  get:
    (query: GetPracticesQuery | undefined) =>
    async ({ set }) => {
      const res = await getPractices(query);
      set(practicesListState, res);
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


