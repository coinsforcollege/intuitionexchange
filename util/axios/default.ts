import axios from "axios";

import { apiUrl } from "./common";

// Create instance
const axiosDefaultInstance = axios.create({
  baseURL: apiUrl[process.env.NODE_ENV],
});

export { axiosDefaultInstance };
