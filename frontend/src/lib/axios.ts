import axios from "axios";

const isProduction = import.meta.env.NODE_ENV === "production";

export const axiosInstance = axios.create({
  baseURL: isProduction
    ? import.meta.env.VITE_API_URL
    : import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
