import { axiosInstance } from "./apiClient";
import type {
  GetPracticesQuery,
  GetPracticesResponse,
  GetPracticeByIdResponse,
  SubmitPracticeAnswerRequest,
  SubmitPracticeAnswerResponse,
} from "./types";

export async function getPractices(query?: GetPracticesQuery) {
  const res = await axiosInstance.get<GetPracticesResponse>("/api/practices", {
    params: query,
  });
  return res.data;
}

export async function getPracticeById(id: number) {
  const res = await axiosInstance.get<GetPracticeByIdResponse>(
    `/api/practices/${id}`
  );
  return res.data;
}

export async function submitPracticeAnswer(
  id: number,
  body: SubmitPracticeAnswerRequest
) {
  const res = await axiosInstance.post<SubmitPracticeAnswerResponse>(
    `/api/practices/${id}/submit`,
    body
  );
  return res.data;
}
