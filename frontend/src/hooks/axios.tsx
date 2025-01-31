import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000',
    withCredentials: true,
    withXSRFToken: true,
    timeoutErrorMessage: 'Request timed out',
});

