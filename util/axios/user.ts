import axios, { AxiosError } from "axios";

// Create instance
const axiosUserInstance = axios.create({
  baseURL: "https://api.intuitionexchange.com",
});

// Set the AUTH token for any request
axiosUserInstance.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("token");
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
      localStorage.removeItem("token");
    }

    throw error;
  }
);

export { axiosUserInstance };
