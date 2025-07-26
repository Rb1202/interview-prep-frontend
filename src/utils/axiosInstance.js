import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 80000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

//Request Interceptor

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    //console.log("Getting token",accessToken);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    //Handle common error globally
    if (error.response) {
      if (error.response.status === 401) {
        console.warn("Unauthorized access-maybe token expired");
      } else if (error.response.status === 500) {
        console.log("Server error. Please try again later.");
      } else if (error.code === "ECONNABORTED") {
        console.log("Request timeout. Please try again.");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
