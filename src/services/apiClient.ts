import axios from "axios";

const BASE_URL = "https://asphyxial-unrefreshed-brodie.ngrok-free.dev";

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

// Attach Firebase ID token to every request if available
axiosInstance.interceptors.request.use(async (config) => {
  const token = await getIdToken();
  if (token) {
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

