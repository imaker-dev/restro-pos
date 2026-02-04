import axios from "axios";
import toast from "react-hot-toast";
import { TOKEN_KEYS } from "../constants";

const baseURL = import.meta.env.VITE_API_URL;

// Get the Bearer token from localStorage
const getBearerToken = () => {
  const token = localStorage.getItem(TOKEN_KEYS.ACCESS);
  return token ? `Bearer ${token}` : null;
};

// Create axios instance
const axiosInstance = axios.create({
  baseURL,
  headers: {
    // Default headers, but we'll modify them conditionally
    Authorization: getBearerToken(),
  },
});

// Request interceptor to handle dynamic content-type based on request body
axiosInstance.interceptors.request.use(
  (config) => {
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

// Response interceptor to handle errors and unauthorized status
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log(error.response.data.error);
      const { status, data } = error.response;
      const errorMessage =
        data?.message || error.response.data.error || "Some unknown error";

      const logoutErrors = [
        "Invalid or expired token",
        "The user belonging to this token no longer exists",
      ];

      if (logoutErrors.includes(errorMessage)) {
        localStorage.removeItem(TOKEN_KEYS.ACCESS);
        window.location.href = "/auth";
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
