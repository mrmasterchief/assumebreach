/* eslint-disable @typescript-eslint/no-explicit-any */
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

export const fetchRefreshToken = async () => {
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

export const resetCTFPassword = async (email: string, securityQuestion: string, newPassword:string) => {
  try {
    const response = await axiosInstance.post("/auth/reset-password", {
      email: email,
      securityQuestion: securityQuestion,
      newPassword: newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
  }
}

export const placeOrder = async (orderObject: any) => {
  try {
    const response = await axiosInstance.post("/user/place-order", {
      orderObject: orderObject,
    });
    return response.data;
  } catch (error) {
    console.error("Error placing order:", error);
  }
}

export const getAllUsers = async (page: number) => {
  try {
    const response = await axiosInstance.get(`/admin/all-users/${page}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all users:", error);
  }
}

export const getReviews = async () => {
  try {
    const response = await axiosInstance.get(`/products/reviews`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }
}

export const postReview = async (review: string) => {
  try {
    const response = await axiosInstance.post("/user/post-review", {
      review: review,
    });
    return response.data;
  } catch (error) {
    console.error("Error posting review:", error);
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
