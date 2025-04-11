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

export const submitFlag = async ({
  unsafeID,
  flag,
}: {
  unsafeID: string;
  flag: string;
}) => {
  try {
    const response = await axiosInstance.post("/ctf/flag", {
      unsafeID: unsafeID,
      flag: flag,
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting flag:", error);
  }
}

export const getSecureCode = async ({secureCodeID}: {secureCodeID: number}) => {
  try {
    const response = await axiosInstance.post("/ctf/secureCode", {
      secureCodeID: secureCodeID,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching secure code:", error);
  }
}


