import { axiosInstance, getAuthHeaders } from "./apiClient";
import type {
  GetQuestionByIdResponse,
  GetQuestionsQuery,
  GetQuestionsResponse,
  SubmitQuestionAnswerRequest,
  SubmitQuestionAnswerResponse,
  ResetAttemptsResponse,
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

export async function submitQuestionAnswer(
  id: number,
  body: SubmitQuestionAnswerRequest,
) {
  const headers = await getAuthHeaders();
  const res = await axiosInstance.post<SubmitQuestionAnswerResponse>(
    `/api/questions/${id}/submit`,
    body,
    { headers },
  );
  return res.data;
}

export async function resetQuestionAttempts() {
  const headers = await getAuthHeaders();
  const res = await axiosInstance.post<ResetAttemptsResponse>(
    "/api/questions/reset/all",
    {},
    { headers },
  );
  return res.data;
}

