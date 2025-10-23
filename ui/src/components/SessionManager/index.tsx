// src/components/auth/SessionManager.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SessionManager = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = () => {
      const sessionRaw = localStorage.getItem("session");
      if (!sessionRaw) {
        logout();
        return;
      }

      try {
        const session = JSON.parse(sessionRaw);
        if (Date.now() > session.expiresAt) {
          logout();
        }
      } catch (e) {
        console.error("Invalid session format", e);
        logout();
      }
    };

    const logout = () => {
      localStorage.removeItem("session");
      alert("Session expired");
      navigate("/signin");
    };

    const interval = setInterval(checkSession, 3600 * 1000); // every 1 min
    checkSession(); // check immediately

    return () => clearInterval(interval);
  }, [navigate]);

  return null;
};

export default SessionManager;
