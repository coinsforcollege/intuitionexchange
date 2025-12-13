import { axiosDefaultInstance } from "./default";
import { axiosUserInstance } from "./user";

export const axiosInstance = {
  default: axiosDefaultInstance,
  user: axiosUserInstance,
};
