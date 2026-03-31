import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/";

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor — attach access token to every request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("melova_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh once per request, and only on 401
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      typeof window !== "undefined"
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("melova_refresh");
      if (!refreshToken) {
        // No refresh token — force logout
        _clearSession();
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${API_URL}api/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access, refresh } = res.data;

        // Store the new tokens
        localStorage.setItem("melova_token", access);
        if (refresh) {
          localStorage.setItem("melova_refresh", refresh);
        }

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed — force logout
        _clearSession();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

function _clearSession() {
  localStorage.removeItem("melova_token");
  localStorage.removeItem("melova_refresh");
  localStorage.removeItem("melova_role");
  localStorage.removeItem("melova_user");
  // Redirect to login
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

export default api;
