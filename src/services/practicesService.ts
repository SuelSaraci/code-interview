import { axiosInstance, getAuthHeaders } from "./apiClient";
import type {
  GetPracticesQuery,
  GetPracticesResponse,
  GetPracticeByIdResponse,
  SubmitPracticeAnswerRequest,
  SubmitPracticeAnswerResponse,
} from "./types";

export async function getPractices(query?: GetPracticesQuery) {
  const headers = await getAuthHeaders();
  const res = await axiosInstance.get<GetPracticesResponse>("/api/practices", {
    params: query,
    headers,
  });
  return res.data;
}

export async function getPracticeById(id: number) {
  const headers = await getAuthHeaders();
  const res = await axiosInstance.get<GetPracticeByIdResponse>(
    `/api/practices/${id}`,
    { headers }
  );
  return res.data;
}

export async function submitPracticeAnswer(
  id: number,
  body: SubmitPracticeAnswerRequest
) {
  const headers = await getAuthHeaders();
  const res = await axiosInstance.post<SubmitPracticeAnswerResponse>(
    `/api/practices/${id}/submit`,
    body,
    { headers }
  );
  return res.data;
}
