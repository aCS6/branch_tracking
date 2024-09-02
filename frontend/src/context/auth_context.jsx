import { createContext, useState } from "react";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? true : false;
  });

  const handleAuthenticate = (token) => {
    if (token) {
      localStorage.setItem("token", token); // token set into localstorage
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("token"); // remove from localstorage
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, handleAuthenticate }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
