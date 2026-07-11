import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROUTE_PATHS } from "../config/paths";

export default function ProRoute({ children }) {
  const { plan } = useSelector((s) => s.license);
  if (plan === "free") {
    return <Navigate to={ROUTE_PATHS.UPGRADE} replace />;
  }
  return children;
}
