import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/store";
import { logout } from "../../../redux/auth/authSlice";
import {
  Bell,
  Search,
  Menu,
  ChevronDown,
  LogOut,
  User,
  Settings,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <header className="
      sticky top-0 z-40
      h-16 md:h-14 lg:h-16
      bg-white/80 backdrop-blur-md
      border-b border-gray-200
      px-4 md:px-5 lg:px-6
      flex items-center justify-between
    ">
      {/* LEFT */}
      <div className="flex items-center gap-4 flex-1">
        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600">
          <Menu size={20} />
        </button>

        {/* Search */}
        {isMobileSearchOpen ? (
          <div className="relative flex-1 md:hidden">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search projects, tasks..."
              className="
                w-full bg-gray-100 border border-gray-300
                rounded-xl pl-10 pr-10 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
              autoFocus
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-200"
              onClick={() => setIsMobileSearchOpen(false)}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="relative hidden md:block">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search projects, tasks..."
              className="
                w-48 md:w-56 lg:w-72 bg-gray-100 border border-gray-300
                rounded-lg md:rounded-lg lg:rounded-xl pl-10 pr-4 py-1.5 md:py-2 text-xs md:text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
            />
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {!isMobileSearchOpen && (
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            onClick={() => setIsMobileSearchOpen(true)}
          >
            <Search size={20} />
          </button>
        )}

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="
              flex items-center gap-2 md:gap-2.5 lg:gap-3 px-2 md:px-2.5 lg:px-3 py-1.5 md:py-1.5 lg:py-2
              rounded-lg md:rounded-lg lg:rounded-xl hover:bg-gray-100 transition
            "
          >
            <div className="
              w-8 md:w-8 lg:w-9 h-8 md:h-8 lg:h-9 rounded-full
              bg-gradient-to-br from-green-500 to-emerald-600
              flex items-center justify-center
              text-white font-semibold text-sm md:text-sm lg:text-base
            ">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>

            <div className="hidden md:block text-left">
              <p className="text-xs md:text-xs lg:text-sm font-semibold text-gray-800 leading-tight">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 leading-tight">
                {user?.role
                  ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                  : "Member"}
              </p>
            </div>

            <ChevronDown size={16} className="hidden md:block text-gray-500 md:w-4 md:h-4 lg:w-4 lg:h-4" />
          </button>

          {isProfileOpen && (
            <div className="
              absolute right-0 mt-2 w-48 md:w-52 lg:w-56
              bg-white border border-gray-200
              rounded-lg md:rounded-lg lg:rounded-xl shadow-xl overflow-hidden
            ">
              <button
                onClick={() => navigate("/profile")}
                className="w-full flex items-center gap-3 px-3 md:px-3.5 lg:px-4 py-2 md:py-2.5 lg:py-3 text-xs md:text-xs lg:text-sm hover:bg-gray-100"
              >
                <User size={16} />
                Profile
              </button>

              <button
                onClick={() => navigate("/settings")}
                className="w-full flex items-center gap-3 px-3 md:px-3.5 lg:px-4 py-2 md:py-2.5 lg:py-3 text-xs md:text-xs lg:text-sm hover:bg-gray-100"
              >
                <Settings size={16} />
                Settings
              </button>

              <div className="border-t border-gray-200" />

              <button
                onClick={() => {
                  dispatch(logout());
                  navigate("/login");
                }}
                className="w-full flex items-center gap-3 px-3 md:px-3.5 lg:px-4 py-2 md:py-2.5 lg:py-3 text-xs md:text-xs lg:text-sm text-red-600 hover:bg-gray-100"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
