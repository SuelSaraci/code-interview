import axios, { AxiosRequestHeaders } from "axios";

// const BASE_URL = "https://asphyxial-unrefreshed-brodie.ngrok-free.dev";
const BASE_URL = "http://localhost:3001";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

async function getIdToken(): Promise<string | null> {
  const { auth } = await import("../lib/firebase");
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
}

export async function getAuthHeaders(): Promise<AxiosRequestHeaders> {
  const token = await getIdToken();
  const headers = {} as AxiosRequestHeaders;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
    // Temporary debug to verify token is being read; remove later if noisy
    console.debug("[apiClient] Using Firebase ID token for request");
  } else {
    console.warn(
      "[apiClient] No Firebase user/token found when building auth headers"
    );
  }
  return headers;
}

// Attach Firebase ID token to every request if available
axiosInstance.interceptors.request.use(async (config) => {
  const token = await getIdToken();
  if (token) {
    if (!config.headers) {
      config.headers = {} as AxiosRequestHeaders;
    }
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});
