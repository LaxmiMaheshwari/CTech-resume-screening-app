import { createPortal } from "react-dom";
import React from "react";

interface LogoutPopupProps {
  open: boolean;
  onClose: () => void;
  position?: {
    left?: string;
    bottom?: string;
  };
}

const LogoutPopup: React.FC<LogoutPopupProps> = ({ open, onClose }) => {
  if (!open) return null;

  const style: React.CSSProperties = {
    position: "fixed",

    left: "clamp(20px, 5vw, 1000px)",
    bottom: "clamp(20px, 2vw, 1000px)",
    width: "clamp(20px, 7vw, 1000px)",
    height: "clamp(20px, 3vw, 1000px)",
    fontSize: "clamp(20px, 1vw, 1000px)",
    zIndex: 9999,
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
    color: "black",
  };

  return createPortal(
    <div
      style={style}
      onMouseLeave={() => {
        onClose();
      }}
    >
      <button
        onClick={() => {
          window.location.href = `${import.meta.env.VITE_API_URL}signout`;
        }}
        className="flex items-center gap-2 w-full h-full justify-center p-2 rounded-md cursor-pointer"
      >
        Logout
      </button>
    </div>,
    document.body
  );
};

export default LogoutPopup;
