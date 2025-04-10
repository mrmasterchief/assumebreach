import { axiosInstance } from "./axios";



export const getFlagsList = async ({ unsafeID }: { unsafeID: string }) => { 
  try {
    const response = await axiosInstance.post("/ctf/flags", {
        unsafeID: unsafeID,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching flags:", error);
  }
}
