import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `/api/api/v1`,
  withCredentials: true,
  timeoutErrorMessage: "Request timed out",
});

const setCsrfToken = (token:string) => {
  if (token) {
    axiosInstance.defaults.headers["CSRF-Token"] = token;
  }
};

const fetchCsrfToken = async (): Promise<string | null> => {
  try {
    const response = await axiosInstance.get("/csrf-token");
    const token = response.data.csrfToken;
    setCsrfToken(token);
    return token;
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
    return null;
  }
};

export { fetchCsrfToken, setCsrfToken, axiosInstance };
