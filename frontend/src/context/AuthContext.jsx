
import { createContext, useContext, useState } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("fittrackUser");
    return stored ? JSON.parse(stored) : null;
  });

  //  FIXED LOGIN
  const login = async (email, password) => {
    const { data } = await API.post("/api/auth/login", { email, password });
    setUser(data);
    localStorage.setItem("fittrackUser", JSON.stringify(data));
    return data;
  };

  //  FIXED REGISTER
  const register = async (formData) => {
    const { data } = await API.post("/api/auth/register", formData);
    setUser(data);
    localStorage.setItem("fittrackUser", JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("fittrackUser");
  };

  const updateUser = (updatedFields) => {
    const merged = { ...user, ...updatedFields };
    setUser(merged);
    localStorage.setItem("fittrackUser", JSON.stringify(merged));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
