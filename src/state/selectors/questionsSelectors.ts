import { selectorFamily } from "recoil";
import { getQuestions, getQuestionById } from "../../services/questionsService";
import type {
  GetQuestionsQuery,
  GetQuestionsResponse,
  Question,
} from "../../services/types";
import { questionsRefreshKeyState } from "../atoms/questionsAtoms";

// Fetch questions directly from the API.
// Recoil selector `get` callbacks only receive `{ get }`, not `{ set }`,
// so trying to call `set` here causes a runtime error and prevents data
// from reaching the UI.
export const questionsQuerySelector = selectorFamily<
  GetQuestionsResponse | null,
  { enabled: boolean }
>({
  key: "questionsQuerySelector",
  get:
    (params) =>
    async ({ get }) => {
      if (!params.enabled) {
        return null;
      }
      // Depend on global refresh key so refetches occur when it changes
      get(questionsRefreshKeyState);
      // No query filters yet – fetch all questions for the user
      const res = await getQuestions();
      return res;
    },
});

// Fetch a single question by id, but only when explicitly enabled.
export const questionByIdSelector = selectorFamily<
  Question | null,
  { id: number; enabled: boolean }
>({
  key: "questionByIdSelector",
  get: (params) => async () => {
    if (!params.enabled || !params.id) {
      return null;
    }
    const res = await getQuestionById(params.id);
    return res.question;
  },
});
