import axios, { AxiosRequestHeaders, AxiosError, InternalAxiosRequestConfig } from "axios";

// const BASE_URL = "https://asphyxial-unrefreshed-brodie.ngrok-free.dev";
const BASE_URL = "http://localhost:5001";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

async function getIdToken(forceRefresh: boolean = false): Promise<string | null> {
  const { auth } = await import("../lib/firebase");
  const user = auth.currentUser;
  if (!user) return null;
  // Force refresh if requested, otherwise get cached token (Firebase auto-refreshes when needed)
  return await user.getIdToken(forceRefresh);
}

export async function getAuthHeaders(forceRefresh: boolean = false): Promise<AxiosRequestHeaders> {
  const token = await getIdToken(forceRefresh);
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
  const token = await getIdToken(false);
  if (token) {
    if (!config.headers) {
      config.headers = {} as AxiosRequestHeaders;
    }
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration - retry with fresh token on 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Check if error is due to expired/invalid token
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      error.response?.data &&
      typeof error.response.data === 'object' &&
      'error' in error.response.data &&
      (error.response.data.error === "Invalid or expired token" ||
       error.response.data.error === "Unauthorized" ||
       error.response.data.message === "Invalid or expired token")
    ) {
      originalRequest._retry = true;

      try {
        // Force refresh the token
        const { auth } = await import("../lib/firebase");
        const user = auth.currentUser;
        
        if (user) {
          // Get a fresh token
          const newToken = await user.getIdToken(true);
          
          if (newToken && originalRequest.headers) {
            // Update the authorization header with the new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            
            // Retry the original request with the new token
            return axiosInstance(originalRequest);
          }
        }
      } catch (refreshError) {
        // If token refresh fails, redirect to login or handle appropriately
        console.error("[apiClient] Failed to refresh token:", refreshError);
        // You might want to dispatch a logout action here
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
