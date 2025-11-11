import React, { useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import CircularSpinner from "../CircularSpinner";
import { RootState } from "../../redux/store";
import useAuth from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading, refetch } = useAuth();
  const { user } = useSelector((state: RootState) => state.loginUser);

  console.log("user", user);
  const handleVisibilityChange = useCallback(() => {
    if (!document.hidden && user) {
      refetch();
    }
  }, [refetch, user]);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleVisibilityChange]);
  if (isLoading)
    return (
      <CircularSpinner
        loader={isLoading}
        backgroundColor="white"
        border="#9061f9"
      />
    );
  return <>{user ? children : <Navigate to={"/signin"} />}</>;
};
export default AuthGuard;
