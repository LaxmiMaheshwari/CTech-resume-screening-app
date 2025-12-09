import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import chatAI from "../../assets/icons/chatAI.svg";
import { RootState } from "../../redux/store";
import LogoutPopup from "../Logout";

export default function Sidebar() {
  const [active, setActive] = useState("AI Chat");
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.loginUser);

  const menuItems = [
    {
      name: "Home",
      icon: chatAI,
      route: "/",
      svgActiveIcon: (
        // <svg
        //   style={{
        //     width: "clamp(12px, 1.4vw, 52px)",
        //     height: "clamp(10px, 1.4vw, 52vw)",
        //   }}
        //   viewBox="0 0 24 24"
        //   fill="none"
        //   xmlns="http://www.w3.org/2000/svg"
        // >
        //   <path
        //     d="M21 20.6C20.8667 20.6 20.7417 20.575 20.625 20.525C20.5083 20.475 20.4 20.4 20.3 20.3L18 18H8C7.45 18 6.97917 17.8042 6.5875 17.4125C6.19583 17.0208 6 16.55 6 16V15H17C17.55 15 18.0208 14.8042 18.4125 14.4125C18.8042 14.0208 19 13.55 19 13V6H20C20.55 6 21.0208 6.19583 21.4125 6.5875C21.8042 6.97917 22 7.45 22 8V19.575C22 19.875 21.9 20.1208 21.7 20.3125C21.5 20.5042 21.2667 20.6 21 20.6ZM4 12.175L5.175 11H15V4H4V12.175ZM3 15.6C2.73333 15.6 2.5 15.5042 2.3 15.3125C2.1 15.1208 2 14.875 2 14.575V4C2 3.45 2.19583 2.97917 2.5875 2.5875C2.97917 2.19583 3.45 2 4 2H15C15.55 2 16.0208 2.19583 16.4125 2.5875C16.8042 2.97917 17 3.45 17 4V11C17 11.55 16.8042 12.0208 16.4125 12.4125C16.0208 12.8042 15.55 13 15 13H6L3.7 15.3C3.6 15.4 3.49167 15.475 3.375 15.525C3.25833 15.575 3.13333 15.6 3 15.6Z"
        //     fill="white"
        //   />
        // </svg>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#FFFFFF"
        >
          <path
            d="M240-200h147.69v-203.08q0-13.73 9.29-23.02 9.29-9.28 23.02-9.28h120q13.73 0 23.02 9.28 9.29 9.29 9.29 23.02V-200H720v-347.69q0-6.16-2.69-11.16t-7.31-8.84L494.62-730q-6.16-5.38-14.62-5.38-8.46 0-14.62 5.38L250-567.69q-4.62 3.84-7.31 8.84-2.69 5-2.69 11.16V-200Zm-40 0v-347.69q0-15.35 6.87-29.08 6.86-13.73 18.98-22.61l215.38-163.08q16.91-12.92 38.65-12.92t38.89 12.92l215.38 163.08q12.12 8.88 18.98 22.61 6.87 13.73 6.87 29.08V-200q0 16.08-11.96 28.04T720-160H564.62q-13.74 0-23.02-9.29-9.29-9.29-9.29-23.02v-203.07H427.69v203.07q0 13.73-9.29 23.02-9.28 9.29-23.02 9.29H240q-16.08 0-28.04-11.96T200-200Zm280-268.46Z"
            fill="white"
          />
        </svg>
      ),
      svgDeactiveIcon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#FFFFFF"
        >
          <path
            d="M240-200h147.69v-203.08q0-13.73 9.29-23.02 9.29-9.28 23.02-9.28h120q13.73 0 23.02 9.28 9.29 9.29 9.29 23.02V-200H720v-347.69q0-6.16-2.69-11.16t-7.31-8.84L494.62-730q-6.16-5.38-14.62-5.38-8.46 0-14.62 5.38L250-567.69q-4.62 3.84-7.31 8.84-2.69 5-2.69 11.16V-200Zm-40 0v-347.69q0-15.35 6.87-29.08 6.86-13.73 18.98-22.61l215.38-163.08q16.91-12.92 38.65-12.92t38.89 12.92l215.38 163.08q12.12 8.88 18.98 22.61 6.87 13.73 6.87 29.08V-200q0 16.08-11.96 28.04T720-160H564.62q-13.74 0-23.02-9.29-9.29-9.29-9.29-23.02v-203.07H427.69v203.07q0 13.73-9.29 23.02-9.28 9.29-23.02 9.29H240q-16.08 0-28.04-11.96T200-200Zm280-268.46Z"
            fill="#BCBCBC"
          />
        </svg>
      ),
    },
    {
      name: "About",
      icon: chatAI,
      route: "/about",
      svgActiveIcon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#FFFFFF"
        >
          <path
            d="M480.03-300q8.51 0 14.24-5.75T500-320v-180q0-8.5-5.76-14.25T479.97-520q-8.51 0-14.24 5.75T460-500v180q0 8.5 5.76 14.25t14.27 5.75ZM480-576.92q10.46 0 17.54-7.08 7.08-7.08 7.08-17.54 0-10.46-7.08-17.54-7.08-7.07-17.54-7.07-10.46 0-17.54 7.07-7.08 7.08-7.08 17.54 0 10.46 7.08 17.54 7.08 7.08 17.54 7.08Zm.13 456.92q-74.67 0-140.41-28.34-65.73-28.34-114.36-76.92-48.63-48.58-76.99-114.26Q120-405.19 120-479.87q0-74.67 28.34-140.41 28.34-65.73 76.92-114.36 48.58-48.63 114.26-76.99Q405.19-840 479.87-840q74.67 0 140.41 28.34 65.73 28.34 114.36 76.92 48.63 48.58 76.99 114.26Q840-554.81 840-480.13q0 74.67-28.34 140.41-28.34 65.73-76.92 114.36-48.58 48.63-114.26 76.99Q554.81-120 480.13-120Zm-.13-40q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
            fill="white"
          />
        </svg>
      ),
      svgDeactiveIcon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#FFFFFF"
        >
          <path
            d="M480.03-300q8.51 0 14.24-5.75T500-320v-180q0-8.5-5.76-14.25T479.97-520q-8.51 0-14.24 5.75T460-500v180q0 8.5 5.76 14.25t14.27 5.75ZM480-576.92q10.46 0 17.54-7.08 7.08-7.08 7.08-17.54 0-10.46-7.08-17.54-7.08-7.07-17.54-7.07-10.46 0-17.54 7.07-7.08 7.08-7.08 17.54 0 10.46 7.08 17.54 7.08 7.08 17.54 7.08Zm.13 456.92q-74.67 0-140.41-28.34-65.73-28.34-114.36-76.92-48.63-48.58-76.99-114.26Q120-405.19 120-479.87q0-74.67 28.34-140.41 28.34-65.73 76.92-114.36 48.58-48.63 114.26-76.99Q405.19-840 479.87-840q74.67 0 140.41 28.34 65.73 28.34 114.36 76.92 48.63 48.58 76.99 114.26Q840-554.81 840-480.13q0 74.67-28.34 140.41-28.34 65.73-76.92 114.36-48.58 48.63-114.26 76.99Q554.81-120 480.13-120Zm-.13-40q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
            fill="#BCBCBC"
          />
        </svg>
      ),
    },
  ];
  const [open, setOpen] = useState(false);

  const changeRoute = (name: string, routeName: string) => {
    setActive(name);
    navigate(routeName);
  };

  return (
    <div
      className="h-screen bg-[#030303] text-white flex flex-col items-center"
      style={{
        paddingTop: "clamp(12px, 1.77vw, 82px)",
        paddingBottom: "clamp(12px, 1.77vw, 82px)",
      }}
    >
      {/* Logo */}
      <div>
        <svg
          width="50"
          height="49"
          viewBox="0 0 50 49"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: "clamp(40px, 2.4vw, 200px)",
            height: "clamp(36px, 2.1vw, 200px)",
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
      </div>

      <div
        className="flex items-center justify-center"
        style={{
          marginTop: " clamp(20px, 1.45vw, 52px)",
        }}
      ></div>

      {/* Menu Items */}
      <div className="flex flex-col w-full">
        {menuItems.map((item) => (
          <button
            key={item.name}
            // onClick={() => setActive(item.name)}
            onClick={() => changeRoute(item.name, item.route)}
            style={{
              marginTop: " clamp(10px, 1.45vw, 52px)",
            }}
            className={`flex flex-col items-center gap-1 py-2 text-sm rounded-md mx-2 transition ${
              active === item.name
                ? "bg-gray-500 text-white font-semibold"
                : "text-gray-300 hover:bg-gray-600"
            }`}
          >
            {/* <img
              src={item.icon}
              alt={item.name}
              style={{
                width: "clamp(12px, 1.4vw, 52px)",
                height: "clamp(10px, 1.4vw, 52vw)",
              }}
            /> */}
            {active === item.name ? (
              <>{item.svgActiveIcon}</>
            ) : (
              <>{item.svgDeactiveIcon}</>
            )}

            <span
              className="font-medium leading-[120%] tracking-normal text-center"
              style={{ fontSize: "clamp(8px, 0.76vw, 32px)" }}
            >
              {item.name}
            </span>
          </button>
        ))}
      </div>

      {/* Bottom Profile */}
      <div className="fixed bottom-[15px] flex justify-center z-50">
        <img
          src={user?.picture}
          alt="profile"
          style={{
            width: "clamp(20px, 2.7vw, 92px)",
            height: "clamp(20px, 2.7vw, 92px)",
          }}
          className="rounded-full cursor-pointer border-2 border-gray-600 hover:border-blue-400"
          onClick={() => {
            setOpen(!open);
          }}
        />

        {/* Popup */}
        <LogoutPopup
          open={open}
          onClose={() => setOpen(false)}
          position={{
            left: "70px", // adjust based on layout
            bottom: "20px",
          }}
        />
      </div>
    </div>
  );
}
