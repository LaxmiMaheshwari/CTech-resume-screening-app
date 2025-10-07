import { useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";

interface Props {
  onLogin: (credentialResponse: any) => void;
  children: React.ReactNode; // ✅ Accept children
}

declare global {
  interface Window {
    google: any;
  }
}

const GoogleLoginButton: React.FC<Props> = ({ onLogin, children }) => {
  const hiddenDivRef = useRef<HTMLDivElement>(null);

  const handleCredentialResponse = (response: any) => {
    console.log("response", response);
    try {
      const userObject = jwtDecode(response.credential);
      const expiresAt = Date.now() + 60 * 1000; // 1 hour from now
      localStorage.setItem(
        "session",
        JSON.stringify({ user: userObject, expiresAt })
      );

      onLogin(userObject);
    } catch (err) {
      console.error("JWT decoding failed", err);
    }
  };

  useEffect(() => {
    if (window.google && hiddenDivRef.current) {
      window.google.accounts.id.initialize({
        client_id:
          "210575793102-m7u0gdgh66ecirgee36e01f6e0rfujqq.apps.googleusercontent.com",
        callback: handleCredentialResponse,
        hosted_domain: "latentview.com", // UI hint only
      });

      window.google.accounts.id.renderButton(hiddenDivRef.current, {
        theme: "outline",
        size: "large",
      });
    }
  }, [onLogin]);

  const handleClick = () => {
    if (!hiddenDivRef.current) return;

    const clickable = hiddenDivRef.current.querySelector<HTMLElement>(
      'button, [role="button"], div[tabindex="0"]'
    );

    if (clickable) {
      clickable.click();
    } else {
      console.warn("No clickable Google button element found");
    }
  };

  return (
    <>
      {/* Hidden Google button */}
      <div
        ref={hiddenDivRef}
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          width: 0,
          height: 0,
        }}
      ></div>

      {/* Your custom button */}
      <div onClick={handleClick}>
        {children} {/* ✅ Render the passed-in custom button */}
      </div>
    </>
  );
};

export default GoogleLoginButton;
