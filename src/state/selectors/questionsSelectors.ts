import { selectorFamily } from "recoil";
import { getQuestions, getQuestionById } from "../../services/questionsService";
import { questionsListState } from "../atoms/questionsAtoms";
import type {
  GetQuestionsQuery,
  Question,
} from "../../services/types";

export const questionsQuerySelector = selectorFamily({
  key: "questionsQuerySelector",
  get:
    (query: GetQuestionsQuery | undefined) =>
    async ({ set }) => {
      const res = await getQuestions(query);
      set(questionsListState, res);
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


