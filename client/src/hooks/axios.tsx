import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `http://localhost:4000/api/v1`,
  withCredentials: true,
  timeoutErrorMessage: "Request timed out",
});

const setCsrfToken = (token:string) => {
  if (token) {
    axiosInstance.defaults.headers["CSRF-Token"] = token;
  }
};

const fetchCsrfToken = async () => {
  try {
    const response = await axiosInstance.get("/csrf-token");
    setCsrfToken(response.data.csrfToken);
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
  }
};

export { fetchCsrfToken, setCsrfToken, axiosInstance };
