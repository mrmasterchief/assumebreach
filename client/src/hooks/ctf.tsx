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

export const fetchFakeAPI = async () => {
  try {
    const apiKey = 'sk_openai_4e2a0f1b-3c5d-4a8b-9f7d-6c0e1f3a2b7c';
    const headers = {
      'x-api-key': apiKey,
    };
    const response = await axiosInstance.post("open-ai", {
      prompt: "Stay alive ping",
    }, {
      headers: headers,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching fake API:", error);
  }
}

export const createCTFUsers = async (amount: number) => {
  try {
    const response = await axiosInstance.post(
      "/cms/create-ctf-users",
      { amount },
      { responseType: "blob" }
    );
    return response;
  } catch (error) {
    console.error("Error creating CTF users:", error);
    throw error;
  }
};

export const CTFCleanUp = async () => {
  try {
    const response = await axiosInstance.delete("/cms/delete-ctf-users");
    return response.data;
  } catch (error) {
    console.error("Error during CTF cleanup:", error);
  }
}


