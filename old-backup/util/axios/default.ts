import axios from "axios";

// Create instance
const axiosDefaultInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export { axiosDefaultInstance };
