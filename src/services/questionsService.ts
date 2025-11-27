import { axiosInstance, getAuthHeaders } from "./apiClient";
import type {
  GetQuestionByIdResponse,
  GetQuestionsQuery,
  GetQuestionsResponse,
} from "./types";

export async function getQuestions(query?: GetQuestionsQuery) {
  const headers = await getAuthHeaders();
  const res = await axiosInstance.get<GetQuestionsResponse>("/api/questions", {
    params: query,
    headers,
  });
  return res.data;
}

export async function getQuestionById(id: number) {
  const headers = await getAuthHeaders();
  const res = await axiosInstance.get<GetQuestionByIdResponse>(
    `/api/questions/${id}`,
    { headers }
  );
  return res.data;
}


