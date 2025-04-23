import { fetchRefreshToken } from "./user";
import { fetchCsrfToken } from "./axios";
import { fetchFakeAPI } from "./ctf";


export const indexFunction = async <T extends unknown[]>(
  functions: { [K in keyof T]: () => Promise<T[K]> },
  callback: (results: T) => void,
  requiresRefreshToken: boolean
): Promise<void> => {
  const csrfToken = await fetchCsrfToken();
  const unsafeID = localStorage.getItem("unsafeID");
  const refreshToken = await fetchRefreshToken();
  await fetchFakeAPI();
  if (window.location.pathname !== "/account/authenticate") {
  if (!csrfToken || !unsafeID || (requiresRefreshToken && !refreshToken)) {
    window.location.href = "/account/authenticate";
    return;
  }
  const results = await Promise.all(functions.map((fn) => fn())) as T;
  callback(results);
  }

  const results = await Promise.all(functions.map((fn) => fn())) as T;
  callback(results);
};

