import { axiosInstance } from "./axios";

export const getUserInfo = async () => {
  try {
    const response = await axiosInstance.get("/user");
    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
};
