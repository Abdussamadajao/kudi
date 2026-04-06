import axios from "axios";
import { router } from "expo-router";
import { authClient } from "./auth-client";

export const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL!,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// attach cookies to every request
axiosInstance.interceptors.request.use((config) => {
  const cookies = authClient.getCookie();
  if (cookies) {
    config.headers["Cookie"] = cookies;
  }
  return config;
});

// handle expired session
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // clear all stored cookies/session
      await authClient.signOut();

      // redirect to sign-in
      router.replace("/(auth)/login");
    }

    return Promise.reject(error);
  },
);
