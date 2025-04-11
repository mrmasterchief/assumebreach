import { fetchCsrfToken } from "../hooks/axios";
import { createContext, useState, useEffect, useContext } from "react";

import { ReactNode } from "react";

const CSRFContext = createContext({
  csrfToken: "",
  setCsrfToken: (token: string) => {},
  isCsrfTokenSet: false,
});

export const CSRFProvider = ({ children }: { children: ReactNode }) => {
  const [csrfToken, setCsrfToken] = useState("");
  const [isCsrfTokenSet, setIsCsrfTokenSet] = useState(false);

  useEffect(() => {
    const getCsrf = async () => {
      await fetchCsrfToken();
      setIsCsrfTokenSet(true);
    };
    getCsrf();
  }, []);

  return (
    <CSRFContext.Provider value={{ csrfToken, setCsrfToken, isCsrfTokenSet }}>
      {children}
    </CSRFContext.Provider>
  );
};

export const useCSRFToken = () => useContext(CSRFContext);
