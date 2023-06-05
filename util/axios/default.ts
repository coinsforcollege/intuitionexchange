import axios from "axios";

// Create instance
const axiosDefaultInstance = axios.create({
  baseURL: "https://api.intuitionexchange.com",
});

export { axiosDefaultInstance };
