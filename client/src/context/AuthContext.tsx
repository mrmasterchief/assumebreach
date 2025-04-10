import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext({
    unsafeID: "",
    setUnsafeID: (unsafeID: string) => {},
    isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [unsafeID, setUnsafeID] = useState<string>("");
    const isAuthenticated = Boolean(unsafeID);

    return (
        <AuthContext.Provider value={{ unsafeID, setUnsafeID, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => useContext(AuthContext);
  