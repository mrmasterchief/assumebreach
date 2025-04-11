import { axiosInstance } from "./axios";

export const getUserInfo = async () => {
  // try {
  //   const response = await axiosInstance.get("/user");
  //   return response.data;
  // } catch (error) {
  //   console.error("Error fetching user info:", error);
  // }
  return 'kaas';
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

export const authenticate = async (endpoint: string, data: any) => {
  return axiosInstance.post(endpoint, data)
    .then((response) => {
        return response
    })
    .catch((error) => {
      console.error("Error during authentication:", error);
      throw error;
    });
}
