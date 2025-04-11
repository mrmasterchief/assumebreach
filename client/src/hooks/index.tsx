import { useRefreshToken } from "./user";
import { fetchCsrfToken } from "./axios";

export const indexFunction = async (
  functions: Array<() => Promise<any>>,
  callback: (results: any[]) => void,
  requiresRefreshToken: boolean
): Promise<void> => {
  const csrfToken = await fetchCsrfToken();
  const unsafeID = localStorage.getItem("unsafeID");
  const refreshToken = await useRefreshToken();

  if (!csrfToken || !unsafeID || (requiresRefreshToken && !refreshToken)) {
    throw new Error("Missing tokens");
  }

  const results: any[] = await Promise.all(functions.map((fn) => fn()));
  callback(results);
};
