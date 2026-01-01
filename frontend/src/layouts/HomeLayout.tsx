import { Outlet } from "react-router-dom";
import Sidebar from "../components/custom/navigation/Sidebar";
import Navbar from "../components/custom/navigation/Navbar";

const HomeLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 text-gray-800">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Wrapper */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Navbar */}
        <div className="shrink-0 z-20">
          <Navbar />
        </div>

        {/* Content Area */}
        <main
          className="
    flex-1 min-h-0
    px-4 sm:px-6 lg:px-10 py-6
    bg-white/60 backdrop-blur-xl
    rounded-tl-2xl
    shadow-inner
    text-gray-700
    transition-all duration-300 ease-in-out

    /* Scroll only on small devices */
    overflow-y-auto

    /* Scrollbar styling ONLY for small screens */
    [&::-webkit-scrollbar]:w-[6px]
    [&::-webkit-scrollbar-track]:bg-transparent
    [&::-webkit-scrollbar-thumb]:bg-gray-400/60
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb]:hover:bg-gray-500/80

    /* Remove scrollbar completely on large screens */
    lg:[&::-webkit-scrollbar]:hidden
  "
        >
          {/* Page Animation Wrapper */}
          <div className="animate-fadeIn">
            <Outlet />
          </div>
        </main>


      </div>
    </div>
  );
};

export default HomeLayout;
