import { axiosInstance } from "./apiClient";
import type {
  GetQuestionByIdResponse,
  GetQuestionsQuery,
  GetQuestionsResponse,
} from "./types";

export async function getQuestions(query?: GetQuestionsQuery) {
  const res = await axiosInstance.get<GetQuestionsResponse>("/api/questions", {
    params: query,
  });
  return res.data;
}

export async function getQuestionById(id: number) {
  const res = await axiosInstance.get<GetQuestionByIdResponse>(`/api/questions/${id}`);
  return res.data;
}


