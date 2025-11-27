import { selectorFamily } from "recoil";
import { getQuestions, getQuestionById } from "../../services/questionsService";
import type {
  GetQuestionsQuery,
  GetQuestionsResponse,
  Question,
} from "../../services/types";

// Fetch questions directly from the API.
// Recoil selector `get` callbacks only receive `{ get }`, not `{ set }`,
// so trying to call `set` here causes a runtime error and prevents data
// from reaching the UI.
export const questionsQuerySelector = selectorFamily<
  GetQuestionsResponse | null,
  { query?: GetQuestionsQuery; enabled: boolean }
>({
  key: "questionsQuerySelector",
  get:
    (params) =>
    async () => {
      if (!params.enabled) {
        return null;
      }
      const res = await getQuestions(params.query);
      return res;
    },
});

export const questionByIdSelector = selectorFamily<Question | null, number>({
  key: "questionByIdSelector",
  get: (id: number) => async () => {
    const res = await getQuestionById(id);
    return res.question;
  },
});


