import axios from "axios";

const baseURL = "https://experts-in-the-city-backend.vercel.app/api";
// const baseURL = "http://localhost:4000/api";

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(`${baseURL}/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, just clear tokens and reject
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
