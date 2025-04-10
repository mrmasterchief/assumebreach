import { axiosInstance } from "./axios";

export const getUserInfo = async () => {
  // try {
  //   const response = await axiosInstance.get("/user");
  //   return response.data;
  // } catch (error) {
  //   console.error("Error fetching user info:", error);
  // }
};

export const useRefreshToken = async () => {
  const refreshToken = async () => {
    try {
      const response = await axiosInstance.post("/auth/refresh-token");
      return response.data;
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  };

  return { refreshToken };
}

