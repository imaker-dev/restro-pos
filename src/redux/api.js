import axios from "axios";
import { clearAuthStorage, getBearerToken } from "../utils/authToken";
import { TOKEN_KEYS } from "../constants";

const baseURL = import.meta.env.VITE_API_URL;

// Create axios instance
const axiosInstance = axios.create({
  baseURL,
});

// Request interceptor to handle dynamic content-type based on request body
axiosInstance.interceptors.request.use(
  (config) => {
    if (!config.headers) config.headers = {};

    const token = getBearerToken();

    if (token) {
      config.headers.Authorization = token;
    }

    // If the request body is FormData, let axios set the Content-Type for multipart/form-data
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      // For JSON requests, set Content-Type to application/json
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  },
);

let _isRefreshing = false;

// Response interceptor to handle errors and unauthorized status
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const errorCode = data?.code;
      const errorMessage = data?.message || data?.error || "Some unknown error";

      // Silent token refresh on TOKEN_EXPIRED
      if (status === 401 && errorCode === "TOKEN_EXPIRED" && !_isRefreshing) {
        _isRefreshing = true;
        try {
          const refreshToken =
            localStorage.getItem(TOKEN_KEYS.REFRESH) ||
            sessionStorage.getItem(TOKEN_KEYS.REFRESH);

          if (refreshToken) {
            const refreshRes = await axios.post(
              `${baseURL}/auth/refresh`,
              { refreshToken },
              { headers: { "Content-Type": "application/json" } },
            );

            if (refreshRes.data?.success) {
              const newToken = refreshRes.data.data.accessToken;
              // Persist in the same storage the original token was in
              if (localStorage.getItem(TOKEN_KEYS.ACCESS)) {
                localStorage.setItem(TOKEN_KEYS.ACCESS, newToken);
              } else {
                sessionStorage.setItem(TOKEN_KEYS.ACCESS, newToken);
              }
              // Retry the original request with the new token
              error.config.headers["Authorization"] = `Bearer ${newToken}`;
              return axiosInstance(error.config);
            }
          }
        } catch (refreshErr) {
          console.error("Token refresh failed:", refreshErr);
        } finally {
          _isRefreshing = false;
        }
        // Refresh failed — clear session and redirect to login
        clearAuthStorage();
        window.location.replace("/admin/auth");
        return Promise.reject(new Error(errorMessage));
      }

      const logoutErrors = [
        "Access token required",
        "Invalid access token",
        "Invalid or expired token",
        "The user belonging to this token no longer exists",
        "Access token expired",
      ];

      if (logoutErrors.includes(errorMessage)) {
        clearAuthStorage();
        window.location.replace("/admin/auth");
      }

      return Promise.reject(new Error(errorMessage));
    }

    return Promise.reject(new Error("Network error"));
  },
);

// Utility methods for GET and POST requests
export const get = async (url, params) => axiosInstance.get(url, { params });
export const post = async (url, params) => axiosInstance.post(url, params);
export const put = async (url, params) => axiosInstance.put(url, params);
export const del = async (url) => axiosInstance.delete(url);

export default axiosInstance;
