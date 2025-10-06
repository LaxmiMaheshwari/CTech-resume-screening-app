// // import { FaHome, FaInfoCircle, FaPhone } from 'react-icons/fa';
// import { Link } from 'react-router-dom';
// import './index.css';

// function Sidebar() {
//   return (
//     <div className="sidebar">
//       {/* <h2 className="logo">MyApp</h2> */}
//       <nav>
//         <Link to="/" className="sidebar-link">
//           <span>Home</span>
//         </Link>
//         <Link to="/about" className="sidebar-link">
//           {/* <FaInfoCircle className="icon" /> */}
//           <span>About</span>
//         </Link>
//       </nav>
//     </div>
//   );
// }

// export default Sidebar;

// import RecentChatItem from "../RecentChatItem";
// import { useDispatch, useSelector } from "react-redux";
// import { setChatHistory } from "../../redux/features/chatSlice";
// import { RootState } from "../../redux/store";
// import { useGetRecentPromptsQuery } from "../../redux/api";
// import { add, HamburgerMenu } from "../../assets/icons";
// import lvLogo from "../../assets/images/lv_logo.png";

// const Sidebar = () => {
//   const nerveCenter = window.location.pathname === "/";
//   const isExpanded = useSelector((state: RootState) => state.sidebar.isOpen);
//   const { user } = useSelector((state: RootState) => state.loginUser);
//   const { chatFetching } = useSelector(
//     (state: RootState) => state.chatOverview
//   );
//   const { data: recentPrompts, isFetching } = useGetRecentPromptsQuery(null, {
//     skip: !user,
//   });
//   const dispatch = useDispatch();
//   const toggleSidebarExpand = () => {
//     dispatch({ type: "sidebar/toggleSidebar" });
//   };
//   return (
//     <div
//       className={`z-50 hidden sm:flex flex-col h-screen max-w-80 justify-between px-4 py-6 duration-500 ${
//         isExpanded ? "w-72" : "w-20"
//       } border-stroke bg-white py-6 shadow-lg`}
//     >
//       <div>
//         <div className="flex items-center space-x-4">
//           <button
//             onClick={toggleSidebarExpand}
//             className="grid place-items-center p-2 hover:bg-brand-100 rounded-full active:bg-brand-200"
//           >
//             <img src={HamburgerMenu} alt="menu" />
//           </button>
//           {isExpanded && (
//             <h2 className="text-2xl text-brand-text font-bold">
//               GrowthOps<span className="text-purple-500">AI</span><span className="text-purple-300">-Dev</span>
//             </h2>
//           )}
//         </div>
//         <button
//           className={`mt-10 flex h-11 ${
//             nerveCenter ? "" : "hidden"
//           }   items-center gap-1 rounded-full bg-brand-200 p-[0.7rem] text-sm text-black hover:bg-gray-200 active:bg-gray-300 duration-300 ${
//             isExpanded ? "w-32" : "w-11"
//           } ${chatFetching ? "opacity-50" : "opacity-100"}`}
//           disabled={chatFetching}
//           onClick={() => dispatch(setChatHistory([]))}
//         >
//           <img src={add} alt="add" className="block" width={20} />
//           <p
//             className={`line-clamp-1 transition-opacity duration-500 ${
//               isExpanded ? "opacity-100" : "opacity-0"
//             }`}
//           >
//             New Chat
//           </p>
//         </button>
//         {isExpanded && nerveCenter ? (
//           <div className="flex flex-col">
//             <p className="my-4 ml-1 text-black font-medium">Recent</p>
//             <div>
//               <RecentChatItem loading={isFetching} chatItems={recentPrompts} />
//             </div>
//           </div>
//         ) : null}
//       </div>
//       {isExpanded && (
//         <div className="flex items-center gap-1 px-2 mt-auto">
//           <img width={45} height={45} src={lvLogo} alt="banner" />
//           <h1 className="text-2xl font-bold text-sky-500 italic">×</h1>
//           <h1 className="text-2xl font-bold">CTech</h1>
//         </div>
//       )}

//     </div>
//   );
// };

// export default Sidebar;

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import lvLogo from "../../assets/images/logo.png";
import chatAI from "../../assets/icons/chatAI.svg";
import knowledgeGraph from "../../assets/icons/knowledge_graph.svg";
import documentsReports from "../../assets/icons/documents_reports.svg";
import savedResponse from "../../assets/icons/saved_response.svg";
import contextBuilder from "../../assets/icons/context_builder.svg";
import { RootState } from "../../redux/store";

export default function Sidebar() {
  const [active, setActive] = useState("AI Chat");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const isRecentSidebarPinged = useSelector(
  //   (state: RootState) => state.sidebar.isRecentSidebarPinged
  // );
  const menuItems = [
    {
      name: "Home",
      icon: chatAI,
      route: "/",
      svgActiveIcon: (
        <svg
          style={{
            width: "clamp(12px, 1.4vw, 52px)",
            height: "clamp(10px, 1.4vw, 52vw)",
          }}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 20.6C20.8667 20.6 20.7417 20.575 20.625 20.525C20.5083 20.475 20.4 20.4 20.3 20.3L18 18H8C7.45 18 6.97917 17.8042 6.5875 17.4125C6.19583 17.0208 6 16.55 6 16V15H17C17.55 15 18.0208 14.8042 18.4125 14.4125C18.8042 14.0208 19 13.55 19 13V6H20C20.55 6 21.0208 6.19583 21.4125 6.5875C21.8042 6.97917 22 7.45 22 8V19.575C22 19.875 21.9 20.1208 21.7 20.3125C21.5 20.5042 21.2667 20.6 21 20.6ZM4 12.175L5.175 11H15V4H4V12.175ZM3 15.6C2.73333 15.6 2.5 15.5042 2.3 15.3125C2.1 15.1208 2 14.875 2 14.575V4C2 3.45 2.19583 2.97917 2.5875 2.5875C2.97917 2.19583 3.45 2 4 2H15C15.55 2 16.0208 2.19583 16.4125 2.5875C16.8042 2.97917 17 3.45 17 4V11C17 11.55 16.8042 12.0208 16.4125 12.4125C16.0208 12.8042 15.55 13 15 13H6L3.7 15.3C3.6 15.4 3.49167 15.475 3.375 15.525C3.25833 15.575 3.13333 15.6 3 15.6Z"
            fill="white"
          />
        </svg>
      ),
      svgDeactiveIcon: (
        <svg
          style={{
            width: "clamp(12px, 1.4vw, 52px)",
            height: "clamp(10px, 1.4vw, 52vw)",
          }}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 20.6C20.8667 20.6 20.7417 20.575 20.625 20.525C20.5083 20.475 20.4 20.4 20.3 20.3L18 18H8C7.45 18 6.97917 17.8042 6.5875 17.4125C6.19583 17.0208 6 16.55 6 16V15H17C17.55 15 18.0208 14.8042 18.4125 14.4125C18.8042 14.0208 19 13.55 19 13V6H20C20.55 6 21.0208 6.19583 21.4125 6.5875C21.8042 6.97917 22 7.45 22 8V19.575C22 19.875 21.9 20.1208 21.7 20.3125C21.5 20.5042 21.2667 20.6 21 20.6ZM4 12.175L5.175 11H15V4H4V12.175ZM3 15.6C2.73333 15.6 2.5 15.5042 2.3 15.3125C2.1 15.1208 2 14.875 2 14.575V4C2 3.45 2.19583 2.97917 2.5875 2.5875C2.97917 2.19583 3.45 2 4 2H15C15.55 2 16.0208 2.19583 16.4125 2.5875C16.8042 2.97917 17 3.45 17 4V11C17 11.55 16.8042 12.0208 16.4125 12.4125C16.0208 12.8042 15.55 13 15 13H6L3.7 15.3C3.6 15.4 3.49167 15.475 3.375 15.525C3.25833 15.575 3.13333 15.6 3 15.6Z"
            fill="#BCBCBC"
          />
        </svg>
      ),
    },
    {
      name: "About",
      icon: knowledgeGraph,
      route: "/about",
      svgActiveIcon: (
        <svg
          style={{
            width: "clamp(12px, 1.4vw, 52px)",
            height: "clamp(10px, 1.4vw, 52vw)",
          }}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 22C11.1667 22 10.4583 21.7083 9.875 21.125C9.29167 20.5417 9 19.8333 9 19C9 18.9167 9.00417 18.825 9.0125 18.725C9.02083 18.625 9.03333 18.5333 9.05 18.45L6.975 17.275C6.70833 17.5083 6.40833 17.6875 6.075 17.8125C5.74167 17.9375 5.38333 18 5 18C4.16667 18 3.45833 17.7083 2.875 17.125C2.29167 16.5417 2 15.8333 2 15C2 14.1667 2.29167 13.4583 2.875 12.875C3.45833 12.2917 4.16667 12 5 12C5.4 12 5.775 12.075 6.125 12.225C6.475 12.375 6.79167 12.5833 7.075 12.85L10.05 11.35C10 10.9667 10.0208 10.5917 10.1125 10.225C10.2042 9.85833 10.3667 9.51667 10.6 9.2L9.75 7.9C9.63333 7.93333 9.5125 7.95833 9.3875 7.975C9.2625 7.99167 9.13333 8 9 8C8.16667 8 7.45833 7.70833 6.875 7.125C6.29167 6.54167 6 5.83333 6 5C6 4.16667 6.29167 3.45833 6.875 2.875C7.45833 2.29167 8.16667 2 9 2C9.83333 2 10.5417 2.29167 11.125 2.875C11.7083 3.45833 12 4.16667 12 5C12 5.33333 11.9458 5.65417 11.8375 5.9625C11.7292 6.27083 11.5833 6.55 11.4 6.8L12.275 8.1C12.4083 8.06667 12.5333 8.04167 12.65 8.025C12.7667 8.00833 12.8917 8 13.025 8C13.3083 8 13.575 8.03333 13.825 8.1C14.075 8.16667 14.3167 8.26667 14.55 8.4L16.2 7.05C16.1333 6.88333 16.0833 6.7125 16.05 6.5375C16.0167 6.3625 16 6.18333 16 6C16 5.16667 16.2917 4.45833 16.875 3.875C17.4583 3.29167 18.1667 3 19 3C19.8333 3 20.5417 3.29167 21.125 3.875C21.7083 4.45833 22 5.16667 22 6C22 6.83333 21.7083 7.54167 21.125 8.125C20.5417 8.70833 19.8333 9 19 9C18.7167 9 18.45 8.9625 18.2 8.8875C17.95 8.8125 17.7083 8.70833 17.475 8.575L15.825 9.95C15.8917 10.1167 15.9417 10.2875 15.975 10.4625C16.0083 10.6375 16.025 10.8167 16.025 11C16.025 11.8333 15.7333 12.5417 15.15 13.125C14.5667 13.7083 13.8583 14 13.025 14C12.625 14 12.2458 13.925 11.8875 13.775C11.5292 13.625 11.2083 13.4167 10.925 13.15L7.975 14.625C8.00833 14.775 8.02083 14.925 8.0125 15.075C8.00417 15.225 7.98333 15.375 7.95 15.525L10.05 16.725C10.3167 16.4917 10.6125 16.3125 10.9375 16.1875C11.2625 16.0625 11.6167 16 12 16C12.8333 16 13.5417 16.2917 14.125 16.875C14.7083 17.4583 15 18.1667 15 19C15 19.8333 14.7083 20.5417 14.125 21.125C13.5417 21.7083 12.8333 22 12 22ZM5 16C5.28333 16 5.52083 15.9042 5.7125 15.7125C5.90417 15.5208 6 15.2833 6 15C6 14.7167 5.90417 14.4792 5.7125 14.2875C5.52083 14.0958 5.28333 14 5 14C4.71667 14 4.47917 14.0958 4.2875 14.2875C4.09583 14.4792 4 14.7167 4 15C4 15.2833 4.09583 15.5208 4.2875 15.7125C4.47917 15.9042 4.71667 16 5 16ZM9 6C9.28333 6 9.52083 5.90417 9.7125 5.7125C9.90417 5.52083 10 5.28333 10 5C10 4.71667 9.90417 4.47917 9.7125 4.2875C9.52083 4.09583 9.28333 4 9 4C8.71667 4 8.47917 4.09583 8.2875 4.2875C8.09583 4.47917 8 4.71667 8 5C8 5.28333 8.09583 5.52083 8.2875 5.7125C8.47917 5.90417 8.71667 6 9 6ZM12 20C12.2833 20 12.5208 19.9042 12.7125 19.7125C12.9042 19.5208 13 19.2833 13 19C13 18.7167 12.9042 18.4792 12.7125 18.2875C12.5208 18.0958 12.2833 18 12 18C11.7167 18 11.4792 18.0958 11.2875 18.2875C11.0958 18.4792 11 18.7167 11 19C11 19.2833 11.0958 19.5208 11.2875 19.7125C11.4792 19.9042 11.7167 20 12 20ZM13 12C13.2833 12 13.5208 11.9042 13.7125 11.7125C13.9042 11.5208 14 11.2833 14 11C14 10.7167 13.9042 10.4792 13.7125 10.2875C13.5208 10.0958 13.2833 10 13 10C12.7167 10 12.4792 10.0958 12.2875 10.2875C12.0958 10.4792 12 10.7167 12 11C12 11.2833 12.0958 11.5208 12.2875 11.7125C12.4792 11.9042 12.7167 12 13 12ZM19 7C19.2833 7 19.5208 6.90417 19.7125 6.7125C19.9042 6.52083 20 6.28333 20 6C20 5.71667 19.9042 5.47917 19.7125 5.2875C19.5208 5.09583 19.2833 5 19 5C18.7167 5 18.4792 5.09583 18.2875 5.2875C18.0958 5.47917 18 5.71667 18 6C18 6.28333 18.0958 6.52083 18.2875 6.7125C18.4792 6.90417 18.7167 7 19 7Z"
            fill="white"
          />
        </svg>
      ),
      svgDeactiveIcon: (
        <svg
          style={{
            width: "clamp(12px, 1.4vw, 52px)",
            height: "clamp(10px, 1.4vw, 52vw)",
          }}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 22C11.1667 22 10.4583 21.7083 9.875 21.125C9.29167 20.5417 9 19.8333 9 19C9 18.9167 9.00417 18.825 9.0125 18.725C9.02083 18.625 9.03333 18.5333 9.05 18.45L6.975 17.275C6.70833 17.5083 6.40833 17.6875 6.075 17.8125C5.74167 17.9375 5.38333 18 5 18C4.16667 18 3.45833 17.7083 2.875 17.125C2.29167 16.5417 2 15.8333 2 15C2 14.1667 2.29167 13.4583 2.875 12.875C3.45833 12.2917 4.16667 12 5 12C5.4 12 5.775 12.075 6.125 12.225C6.475 12.375 6.79167 12.5833 7.075 12.85L10.05 11.35C10 10.9667 10.0208 10.5917 10.1125 10.225C10.2042 9.85833 10.3667 9.51667 10.6 9.2L9.75 7.9C9.63333 7.93333 9.5125 7.95833 9.3875 7.975C9.2625 7.99167 9.13333 8 9 8C8.16667 8 7.45833 7.70833 6.875 7.125C6.29167 6.54167 6 5.83333 6 5C6 4.16667 6.29167 3.45833 6.875 2.875C7.45833 2.29167 8.16667 2 9 2C9.83333 2 10.5417 2.29167 11.125 2.875C11.7083 3.45833 12 4.16667 12 5C12 5.33333 11.9458 5.65417 11.8375 5.9625C11.7292 6.27083 11.5833 6.55 11.4 6.8L12.275 8.1C12.4083 8.06667 12.5333 8.04167 12.65 8.025C12.7667 8.00833 12.8917 8 13.025 8C13.3083 8 13.575 8.03333 13.825 8.1C14.075 8.16667 14.3167 8.26667 14.55 8.4L16.2 7.05C16.1333 6.88333 16.0833 6.7125 16.05 6.5375C16.0167 6.3625 16 6.18333 16 6C16 5.16667 16.2917 4.45833 16.875 3.875C17.4583 3.29167 18.1667 3 19 3C19.8333 3 20.5417 3.29167 21.125 3.875C21.7083 4.45833 22 5.16667 22 6C22 6.83333 21.7083 7.54167 21.125 8.125C20.5417 8.70833 19.8333 9 19 9C18.7167 9 18.45 8.9625 18.2 8.8875C17.95 8.8125 17.7083 8.70833 17.475 8.575L15.825 9.95C15.8917 10.1167 15.9417 10.2875 15.975 10.4625C16.0083 10.6375 16.025 10.8167 16.025 11C16.025 11.8333 15.7333 12.5417 15.15 13.125C14.5667 13.7083 13.8583 14 13.025 14C12.625 14 12.2458 13.925 11.8875 13.775C11.5292 13.625 11.2083 13.4167 10.925 13.15L7.975 14.625C8.00833 14.775 8.02083 14.925 8.0125 15.075C8.00417 15.225 7.98333 15.375 7.95 15.525L10.05 16.725C10.3167 16.4917 10.6125 16.3125 10.9375 16.1875C11.2625 16.0625 11.6167 16 12 16C12.8333 16 13.5417 16.2917 14.125 16.875C14.7083 17.4583 15 18.1667 15 19C15 19.8333 14.7083 20.5417 14.125 21.125C13.5417 21.7083 12.8333 22 12 22ZM5 16C5.28333 16 5.52083 15.9042 5.7125 15.7125C5.90417 15.5208 6 15.2833 6 15C6 14.7167 5.90417 14.4792 5.7125 14.2875C5.52083 14.0958 5.28333 14 5 14C4.71667 14 4.47917 14.0958 4.2875 14.2875C4.09583 14.4792 4 14.7167 4 15C4 15.2833 4.09583 15.5208 4.2875 15.7125C4.47917 15.9042 4.71667 16 5 16ZM9 6C9.28333 6 9.52083 5.90417 9.7125 5.7125C9.90417 5.52083 10 5.28333 10 5C10 4.71667 9.90417 4.47917 9.7125 4.2875C9.52083 4.09583 9.28333 4 9 4C8.71667 4 8.47917 4.09583 8.2875 4.2875C8.09583 4.47917 8 4.71667 8 5C8 5.28333 8.09583 5.52083 8.2875 5.7125C8.47917 5.90417 8.71667 6 9 6ZM12 20C12.2833 20 12.5208 19.9042 12.7125 19.7125C12.9042 19.5208 13 19.2833 13 19C13 18.7167 12.9042 18.4792 12.7125 18.2875C12.5208 18.0958 12.2833 18 12 18C11.7167 18 11.4792 18.0958 11.2875 18.2875C11.0958 18.4792 11 18.7167 11 19C11 19.2833 11.0958 19.5208 11.2875 19.7125C11.4792 19.9042 11.7167 20 12 20ZM13 12C13.2833 12 13.5208 11.9042 13.7125 11.7125C13.9042 11.5208 14 11.2833 14 11C14 10.7167 13.9042 10.4792 13.7125 10.2875C13.5208 10.0958 13.2833 10 13 10C12.7167 10 12.4792 10.0958 12.2875 10.2875C12.0958 10.4792 12 10.7167 12 11C12 11.2833 12.0958 11.5208 12.2875 11.7125C12.4792 11.9042 12.7167 12 13 12ZM19 7C19.2833 7 19.5208 6.90417 19.7125 6.7125C19.9042 6.52083 20 6.28333 20 6C20 5.71667 19.9042 5.47917 19.7125 5.2875C19.5208 5.09583 19.2833 5 19 5C18.7167 5 18.4792 5.09583 18.2875 5.2875C18.0958 5.47917 18 5.71667 18 6C18 6.28333 18.0958 6.52083 18.2875 6.7125C18.4792 6.90417 18.7167 7 19 7Z"
            fill="#BCBCBC"
          />
        </svg>
      ),
    },
  ];
  const [open, setOpen] = useState(false);

  const changeRoute = (name: string, routeName: string) => {
    // dispatch({ type: "sidebar/toggleRecentSidebar" });
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
        <img
          src={lvLogo}
          alt="logo"
          style={{
            width: "clamp(36px, 2.5vw, 100px)",
            height: "clamp(33px, 2.2vw, 80vw)",
          }}
        />
      </div>

      <div
        className="flex items-center justify-center"
        style={{
          marginTop: " clamp(20px, 1.45vw, 52px)",
        }}
      >
        <button
          className="p-[10px] rounded-full bg-[#3A70C9]  hover:bg-blue-600 "
          style={{
            padding: " clamp(10px, 0.833vw, 52px)",
          }}
        >
          <svg
            viewBox="0 0 20 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              width: "clamp(12px, 1.4vw, 52px)",
              height: "clamp(10px, 1.4vw, 52vw)",
            }}
          >
            <path
              d="M2 20.9996C1.45 20.9996 0.979167 20.8038 0.5875 20.4121C0.195833 20.0204 0 19.5496 0 18.9996V4.99961C0 4.44961 0.195833 3.97878 0.5875 3.58711C0.979167 3.19544 1.45 2.99961 2 2.99961H8.525C8.85833 2.99961 9.10833 3.10378 9.275 3.31211C9.44167 3.52044 9.525 3.74961 9.525 3.99961C9.525 4.24961 9.4375 4.47878 9.2625 4.68711C9.0875 4.89544 8.83333 4.99961 8.5 4.99961H2V18.9996H16V12.4746C16 12.1413 16.1042 11.8913 16.3125 11.7246C16.5208 11.5579 16.75 11.4746 17 11.4746C17.25 11.4746 17.4792 11.5579 17.6875 11.7246C17.8958 11.8913 18 12.1413 18 12.4746V18.9996C18 19.5496 17.8042 20.0204 17.4125 20.4121C17.0208 20.8038 16.55 20.9996 16 20.9996H2ZM6 13.9996V11.5746C6 11.3079 6.05 11.0538 6.15 10.8121C6.25 10.5704 6.39167 10.3579 6.575 10.1746L15.175 1.57461C15.375 1.37461 15.6 1.22461 15.85 1.12461C16.1 1.02461 16.35 0.974609 16.6 0.974609C16.8667 0.974609 17.1208 1.02461 17.3625 1.12461C17.6042 1.22461 17.825 1.37461 18.025 1.57461L19.425 2.99961C19.6083 3.19961 19.75 3.42044 19.85 3.66211C19.95 3.90378 20 4.14961 20 4.39961C20 4.64961 19.9542 4.89544 19.8625 5.13711C19.7708 5.37878 19.625 5.59961 19.425 5.79961L10.825 14.3996C10.6417 14.5829 10.4292 14.7288 10.1875 14.8371C9.94583 14.9454 9.69167 14.9996 9.425 14.9996H7C6.71667 14.9996 6.47917 14.9038 6.2875 14.7121C6.09583 14.5204 6 14.2829 6 13.9996ZM8 12.9996H9.4L15.2 7.19961L14.5 6.49961L13.775 5.79961L8 11.5746V12.9996Z"
              fill="white"
            />
          </svg>
        </button>
      </div>

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
          // src={user?.picture}
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
        {open && (
          <div
            style={{
              width: "clamp(100px, 13vw, 500px)",
            }}
            className="absolute bottom-[20px] left-full ml-2
          text-gray-900 bg-white rounded-xl shadow-lg p-2 z-[9999]"
            onMouseOut={() => setOpen(false)}
          >
            <button className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-gray-100">
              Account Settings
            </button>
            <button
              onClick={() => {
                window.location.href = `${import.meta.env.VITE_API_URL}signout`;
              }}
              className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
