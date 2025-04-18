import { axiosInstance } from "./axios";

export const getUserInfo = async ({ unsafeID }: { unsafeID: string }) => {
  try {
    const response = await axiosInstance.get("/user/details", {
      params: {
        unsafeID: unsafeID,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
  return null;
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

export const resetCTFPassword = async (email: string, securityQuestion: string) => {
  try {
    const response = await axiosInstance.post("/auth/reset-password", {
      email: email,
      securityQuestion: securityQuestion,
    });
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
  }
}



export const logout = async () => {
  try {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Error logging out:", error);
  }
}
