// import { useEffect } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { Session } from "../../types/login";

// interface Props {
//   children: React.ReactNode;
// }

// const AuthGuard: React.FC<Props> = ({ children }) => {
//   const location = useLocation();

//   const sessionRaw = localStorage.getItem("session");

//   if (!sessionRaw) {
//     return <Navigate to="/signin" state={{ from: location }} replace />;
//   }

//   const session: Session = JSON.parse(sessionRaw);

//   if (Date.now() > session.expiresAt) {
//     localStorage.removeItem("session");
//     return <Navigate to="/signin" state={{ from: location }} replace />;
//   }

//   return <>{children}</>;
// };

// export default AuthGuard;

import React, { useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import CircularSpinner from "../CircularSpinner";
import { RootState } from "../../redux/store";
import useAuth from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading, refetch } = useAuth();
  const { user } = useSelector((state: RootState) => state.loginUser);
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
