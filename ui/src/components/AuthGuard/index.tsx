import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Session } from "../../types/login";

interface Props {
  children: React.ReactNode;
}

const AuthGuard: React.FC<Props> = ({ children }) => {
  const location = useLocation();

  const sessionRaw = localStorage.getItem("session");

  if (!sessionRaw) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  const session: Session = JSON.parse(sessionRaw);

  console.log("session", session);

  if (Date.now() > session.expiresAt) {
    localStorage.removeItem("session");
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
