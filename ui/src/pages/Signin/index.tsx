import { useRef } from "react";
import lv_logo from "../../assets/images/lv_logo_img.png";
import google from "../../assets/icons/google.svg";
import background from "../../assets/video/background.mp4";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function Signin() {
  const { user } = useSelector((state: RootState) => state.loginUser);
  const videoRef = useRef(null);
  const signin = () =>
    (window.location.href = `${import.meta.env.VITE_API_URL}auth/google`);
  return (
    <>
      {user ? (
        <Navigate to={"/"} />
      ) : (
        <div className="relative h-screen w-screen overflow-hidden">
          {/* Background video */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
          >
            <source src={background} type="video/mp4" />
          </video>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Logo */}

          <div
            className="absolute  inline-flex items-end "
            style={{
              top: "clamp(21.3px, 2.778vw, 100px)",
              left: "clamp(19.2px, 2.5vw, 100px)",
            }}
          >
            <div className="flex">
              <img
                src={lv_logo}
                alt="LatentView Logo"
                className="object-contain block"
                style={{
                  width: "clamp(89px, 11.58vw, 150px)",
                }}
              />
              &nbsp;&nbsp;
              <span
                className="text-sky-500 font-poppins font-normal self-end mb-[1px] 5xl: mb-[3px]"
                style={{ fontSize: "clamp(10.7px, 1.389vw, 52px)" }}
              >
                x
              </span>
              &nbsp;
              <span
                className="text-white font-poppins font-normal self-end mb-[1px] 5xl: mb-[3px]"
                style={{ fontSize: "clamp(10.7px, 1.389vw, 52px)" }}
              >
                CTech
              </span>
            </div>
          </div>

          {/* Login Card */}

          <div
            className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center justify-center
                        backdrop-blur-2xl border border-white/20 rounded-[32px] shadow-xl
                        bg-[#152D474D] h-auto  "
            style={{
              width: "clamp(300px, 28vw, 100vw)",
              height: "clamp(247px, 32.22vw, 100vw)",
              right: "clamp(25px, 3.33vw, 200px)",
            }}
          >
            <div className="my-[67px] flex flex-col items-center justify-center">
              {/* Logo */}
              {/* <img
                src={appLogo}
                alt="LatentView Logo"
                className="object-contain"
                style={{
                  width: "clamp(40px, 3.4vw, 200px)",
                  height: "clamp(36px, 3.1vw, 200px)",
                }}
              /> */}

              <svg
                width="50"
                height="49"
                viewBox="0 0 50 49"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  width: "clamp(40px, 3.4vw, 200px)",
                  height: "clamp(36px, 3.1vw, 200px)",
                }}
              >
                <path
                  d="M50 24.0937L34.7044 48.1874L30.9935 42.3432L41.9229 25.1275L42.5783 24.0937L41.9229 23.0599L30.9935 5.84615V5.84415L34.7044 0L50 24.0937Z"
                  fill="#125CC6"
                />
                <path
                  d="M24.8088 11.3875L21.2891 5.84415L25 0L28.5176 5.54139L24.8088 11.3875Z"
                  fill="#228AFF"
                />
                <path
                  d="M40.2956 24.0934L25 48.1871L21.2891 42.343L32.2185 25.1272L32.8739 24.0934L32.2185 23.0596L26.1433 13.4885L29.8522 7.64453L40.2956 24.0934Z"
                  fill="#228AFF"
                />
                <path
                  d="M30.5912 24.0937L23.6654 35.0012L15.2956 48.1874L9.53311 39.1104L7.87188 36.4951L3.62919 29.8104L0 24.0937L6.92574 13.1842L15.2956 0L23.6654 13.1842L23.6674 13.186L16.7457 24.0977L15.3036 26.3704L9.41758 17.1022L9.41558 17.1062L8.087 19.1997L12.5209 26.1852L15.3036 30.5691L18.0782 26.1991L25.002 15.2896L26.962 18.377L30.5912 24.0937Z"
                  fill="#E1F4FF"
                />
                <path
                  opacity="0.4"
                  d="M18.0782 26.1995L23.6655 35.0016L15.2956 48.1878L9.53311 39.1108L6.92575 35.0016L12.5209 26.1855L15.3036 30.5695L18.0782 26.1995Z"
                  fill="#228AFF"
                />
                <path
                  opacity="0.4"
                  d="M9.41559 17.1062L6.92575 13.1842L15.2956 0L23.6655 13.1842L16.7417 24.0937L16.7457 24.0977L15.3036 26.3704L9.41759 17.1022L9.41559 17.1062Z"
                  fill="#228AFF"
                />
                <path
                  d="M34.7044 0L30.9935 5.84615V5.84415L34.7044 0Z"
                  fill="white"
                />
              </svg>

              {/* Heading */}

              {/* 32px */}
              <h2
                className="text-white text-center mt-3 font-poppins font-medium leading-[100%] tracking-[0%]"
                style={{ fontSize: "clamp(18px, 2.22vw, 100px)" }}
              >
                Resume Screening
              </h2>

              {/* Description */}

              {/* mt-30px px-5 */}
              <div
                className="text-[#dedede] text-center"
                style={{
                  marginTop: "clamp(16px, 2.08vw, 100px)",
                  paddingLeft: "clamp(10px, 1.39vw, 100px)",
                  paddingRight: "clamp(10px, 1.39vw, 100px)",
                }}
              >
                {/* text-12px */}
                <span
                  className="font-manrope font-normal leading-relaxed"
                  style={{ fontSize: "clamp(8px, 0.833vw, 52px)" }}
                >
                  Automates resume filtering to quickly identify and shortlist
                  the best candidates
                </span>
              </div>

              {/* Google Sign-in Button */}
              <button
                onClick={() => signin()}
                className="flex items-center justify-center bg-white rounded-md shadow hover:bg-gray-100 transition py-2 "
                style={{
                  width: "clamp(177px, 20.05vw, 1500px)",
                  marginTop: "clamp(10px, 2vw, 200px)",
                  paddingTop: "clamp(8px, 0.56vw, 30px)",
                  paddingBottom: "clamp(8px, 0.56vw, 30px)",
                }}
              >
                <img
                  src={google}
                  alt="Google"
                  className="
                  mr-2"
                  style={{
                    width: "clamp(13px, 1.67vw, 100px)",
                    height: "clamp(13px, 1.67vw, 100px)",
                  }}
                />
                <span
                  className="font-roboto font-medium text-black leading-[100%] tracking-[0%]"
                  style={{ fontSize: "clamp(8px, 1.11vw, 52px)" }}
                >
                  Sign in with Google
                </span>
              </button>

              {/* <GoogleLoginButton onLogin={handleLogin}>
              <button
                className="flex items-center justify-center bg-white rounded-md shadow hover:bg-gray-100 transition py-2 "
                style={{
                  width: "clamp(177px, 20.05vw, 1500px)",
                  marginTop: "clamp(10px, 2vw, 200px)",
                  paddingTop: "clamp(8px, 0.56vw, 30px)",
                  paddingBottom: "clamp(8px, 0.56vw, 30px)",
                }}
              >
                <img
                  src={google}
                  alt="Google"
                  className="
                  mr-2"
                  style={{
                    width: "clamp(13px, 1.67vw, 100px)",
                    height: "clamp(13px, 1.67vw, 100px)",
                  }}
                />
                <span
                  className="font-roboto font-medium text-black leading-[100%] tracking-[0%]"
                  style={{ fontSize: "clamp(8px, 1.11vw, 52px)" }}
                >
                  Sign in with Google
                </span>
              </button>
            </GoogleLoginButton> */}
            </div>
          </div>

          {/* style={{ top: `${taglineTop}px` }} */}
          {/* top-[calc(50%+250px)] */}
          {/* <div
          className=" fixed bottom-0 absolute -translate-y-1/2 flex flex-col items-center justify-center text-center
                        text-white bg-[#00000066] backdrop-blur-2xl opacity-100
                        rounded-[24px] p-[10px]"
          style={{
            width: "clamp(195px, 28vw, 1500px)",
            height: "clamp(20px, 2.63vw, 400px)",
            right: "clamp(25px, 3.33vw, 200px)",
          }}
        >
          <p
            className="font-poppins font-normal leading-[100%] tracking-[0%]"
            style={{ fontSize: "clamp(6.4px, 0.833vw, 50px)" }}
          >
            Powered by Pragya AI & GraphDB | Built by Team Nirvana
          </p>
        </div> */}
        </div>
      )}
    </>
  );
}
