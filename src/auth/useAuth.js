import React, { createContext, useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const authContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  
  const login = (userDetails) => {
    localStorage.setItem("user", JSON.stringify(userDetails));
    localStorage.setItem("token", userDetails.token);
    setUser(userDetails);

    if (userDetails.userType === "admin") {
      navigate(location.state?.path || "/admin/dashboard");
    }
    if (userDetails.userType === "contributor") {
      navigate("/contributor/dashboard/content");
    }
    const decoded = jwt_decode(userDetails.token);
    localStorage.setItem("authUser", JSON.stringify(decoded));
  };

  const logout = () => {
    setUser({});
    navigate("/", { replace: true });
    localStorage.clear();
  };

  return (
    <authContext.Provider value={{ user, login, logout }}>
      {children}
    </authContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(authContext);
};
