import { atom } from "recoil";
import type { GetQuestionsResponse } from "../../services/types";

export const questionsListState = atom<GetQuestionsResponse | null>({
  key: "questionsListState",
  default: null,
});


