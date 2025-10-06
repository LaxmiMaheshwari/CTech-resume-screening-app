import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Sidebar from "../../components/Sidebar";
// import ChatHistory from "../../components/ChatHistory";

const Home = () => {
  // return <Outlet />;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className="w-[200px] bg-gray-900 text-white h-screen sticky top-0"
        style={{
          width: " clamp(82px, 5.9vw, 200px)",
        }}
      >
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-gray-100">
        <Outlet />
      </main>
    </div>

    // <div style={{ display: 'flex' }} className="flex h-screen overflow-hidden">
    //   <aside className="w-[82px] sticky top-0 inset-y-0 left-0 bg-gray-900 text-white
    //                   w-[82px] sm:w-[50px] md:w-[55px] lg:w-[80px] xl:w-[82px] 2xl:w-[92px] 3xl:w-[100px] 4xl:w-[120px] 5xl:w-[130px]
    //   ">
    //     <Sidebar />
    //   </aside>
    //   <main className="flex-1 overflow-y-auto bg-gray-900

    //   ">
    //     <Outlet />
    //   </main>

    // </div>
  );
};

export default Home;
