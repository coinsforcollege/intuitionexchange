import axios, { AxiosError } from "axios";

import { useUserStore } from "../../store/user-store";
import { apiUrl } from "./common";

// Create instance
const axiosUserInstance = axios.create({
  baseURL: apiUrl[process.env.NODE_ENV],
});

// Set the AUTH token for any request
axiosUserInstance.interceptors.request.use((config: any) => {
  const token = useUserStore.getState().user?.token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = token ? `Bearer ${token}` : "";
  }

  return config;
});

// Set the AUTH token for any request
axiosUserInstance.interceptors.response.use(
  function (response) {
    return response;
  },

  function (error: AxiosError) {
    if (error.response?.status === 401) {
      useUserStore.getState().setUser(null);
    }

    throw error;
  }
);

export { axiosUserInstance };
