import type { FC, PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute: FC<PropsWithChildren> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <div>{isAuthenticated ? children : <Navigate to="/login" replace />}</div>
  );
};

export default ProtectedRoute;
