import { atom, atomFamily } from "recoil";
import type { GetQuestionsResponse } from "../../services/types";

export const questionsListState = atom<GetQuestionsResponse | null>({
  key: "questionsListState",
  default: null,
});

// Global refresh key so any component can trigger a refetch of questions
export const questionsRefreshKeyState = atom<number>({
  key: "questionsRefreshKeyState",
  default: 0,
});

// Store last selected option per question so we can re-highlight it later
export const questionSelectionState = atomFamily<number | null, number>({
  key: "questionSelectionState",
  default: null,
});

