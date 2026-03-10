import axios from "axios";
import { store } from "../app/store";
import { setAccessToken, logout } from "../features/auth/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config._sentWithToken = true;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // Only attempt refresh if this request was sent WITH a token
    if (error.response?.status === 401 && !original._retry && original._sentWithToken) {
      original._retry = true;
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const newToken = data.data.accessToken;
        store.dispatch(setAccessToken(newToken));
        original.headers.Authorization = `Bearer ${newToken}`;
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
