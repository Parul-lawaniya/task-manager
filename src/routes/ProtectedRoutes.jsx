import React from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../utils/Auth";

export default function ProtectedRoutes({ children }) {
  const token = getToken();

  // If there is no token then redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  
  return children;
}
