import React from "react";
import toastMessage from "../components/ToastMessage";
import { useAuth } from "./useAuth";
import { useLocation, Navigate } from "react-router-dom";
const getUser = JSON.parse(localStorage.getItem("user"));

export const RequireAuth = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();
  return auth?.user?.email || getUser?.email ? (
    children
  ) : (
    <>
      <Navigate to="/" replace state={{ path: location.pathname }} />
      {toastMessage({
        type: "error",
        message: "User not authenticated !",
      })}
    </>
  );
};

export const RequireAdmin = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();
  return auth?.user?.userType === "admin" || getUser?.userType === "admin" ? (
    children
  ) : (
    <>
      <Navigate to="/" replace state={{ path: location.pathname }} />
      {toastMessage({
        type: "error",
        message: "User not authenticated as Admin !",
      })}
    </>
  );
};

export const RequireContributor = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();
  return auth?.user?.userType === "contributor" ||
    getUser?.userType === "contributor" ? (
    children
  ) : (
    <>
      <Navigate to="/" replace state={{ path: location.pathname }} />
      {toastMessage({
        type: "error",
        message: "User not authenticated as Contributor !",
      })}
    </>
  );
};

export const RequireLogout = ({ children }) => {
  const auth = useAuth();

  return !auth?.user.email || !getUser.email? (
    children
  ) : (
    <>
    
      {toastMessage({
        type: "error",
        message: "User logged in !",
      })}
    </>
  );
};
