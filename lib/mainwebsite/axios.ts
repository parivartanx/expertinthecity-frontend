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
    // Also check that this is not an authentication request to avoid loops
    if (error.response?.status === 401 && !originalRequest._retry && 
        !originalRequest.url?.includes('/auth/login') && 
        !originalRequest.url?.includes('/auth/register') &&
        !originalRequest.url?.includes('/auth/refresh-token')) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        
        if (!refreshToken) {
          console.log("No refresh token available, redirecting to login");
          // Clear any existing tokens
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          
          // If we're in a browser context, redirect to login
          if (typeof window !== 'undefined') {
            // You might want to redirect to login page here
            // window.location.href = '/login';
          }
          
          throw new Error("No refresh token available");
        }

        console.log("Attempting to refresh token...");
        
        const response = await axios.post(`${baseURL}/auth/refresh-token`, {
          refreshToken,
        });

        console.log("Refresh token response:", response.data);

        // Handle different possible response structures
        let accessToken, newRefreshToken;
        
        if (response.data.data) {
          ({ accessToken, refreshToken: newRefreshToken } = response.data.data);
        } else if (response.data.accessToken) {
          ({ accessToken, refreshToken: newRefreshToken } = response.data);
        } else {
          throw new Error("Invalid refresh token response format");
        }

        if (!accessToken) {
          throw new Error("No access token received from refresh");
        }

        localStorage.setItem("accessToken", accessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError: any) {
        console.error("Token refresh failed:", refreshError);
        
        // If refresh token fails, clear tokens and reject
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        
        // If we're in a browser context, redirect to login
        if (typeof window !== 'undefined') {
          // You might want to redirect to login page here
          // window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
