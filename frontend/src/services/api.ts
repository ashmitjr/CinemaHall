import axios from "axios";
import { store } from "../app/store";
import { setAccessToken, logout } from "../features/auth/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        store.dispatch(setAccessToken(data.data.accessToken));
        if (original.headers) {
          original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        }
        return api(original);
      } catch {
        store.dispatch(logout());
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
