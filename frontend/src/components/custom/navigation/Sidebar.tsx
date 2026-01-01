import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Home,
  FolderKanban,
  CheckSquare,
  User,
  Settings,
  ChevronRight,
  X,
} from "lucide-react";
import { RootState } from "../../../redux/store";

/* ======================================================
   Sidebar
====================================================== */

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  /* Close on route change */
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  /* Close if resized to desktop */
  useEffect(() => {
    const onResize = () => window.innerWidth >= 768 && setIsMobileOpen(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* Role-based navigation */
  const NAV: Record<string, any[]> = {
    admin: [
      { path: "/admin", label: "Home", icon: Home },
      { path: "/projects", label: "Projects", icon: FolderKanban },
      { path: "/issues", label: "Issues", icon: CheckSquare },
      { path: "/people", label: "People", icon: User },
      { path: "/settings", label: "Settings", icon: Settings },
    ],
    manager: [
      { path: "/manager", label: "Home", icon: Home },
      { path: "/projects", label: "Projects", icon: FolderKanban },
      { path: "/issues", label: "Issues", icon: CheckSquare },
      { path: "/people", label: "People", icon: User },
      { path: "/settings", label: "Settings", icon: Settings },
    ],
    employee: [
      { path: "/employee", label: "Home", icon: Home },
      { path: "/projects", label: "Projects", icon: FolderKanban },
      { path: "/issues", label: "Issues", icon: CheckSquare },
      { path: "/settings", label: "Settings", icon: Settings },
    ],
    default: [
      { path: "/home", label: "Home", icon: Home },
      { path: "/projects", label: "Projects", icon: FolderKanban },
      { path: "/issues", label: "Issues", icon: CheckSquare },
      { path: "/people", label: "People", icon: User },
      { path: "/settings", label: "Settings", icon: Settings },
    ],
  };

  const navItems = NAV[user?.role || "default"];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-900 text-white shadow"
      >
        <ChevronRight size={18} />
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static z-50 h-full w-56
          bg-white/80 backdrop-blur-xl
          border-r border-gray-200/60
          flex flex-col
          transition-transform duration-300 ease-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="
  h-16 md:h-14 lg:h-16 px-4
  flex items-center justify-between
  border-b border-gray-200
  bg-white/80 backdrop-blur-md
">
          <div className="flex items-center gap-2">
            <div className="w-7 md:w-6 lg:w-8 h-7 md:h-6 lg:h-8 rounded-lg bg-green-500 text-white flex items-center justify-center font-bold text-sm md:text-xs lg:text-base">
              Z
            </div>
            <span className="font-semibold text-gray-700 text-base md:text-sm lg:text-lg">Zyro</span>
          </div>

          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1 md:p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 md:py-2.5 lg:py-4 space-y-0.5 md:space-y-0.5 lg:space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `
                group flex items-center gap-3 px-3 py-1.5 md:py-1.5 lg:py-2 rounded-lg
                text-xs md:text-xs lg:text-xs font-medium transition-all
                ${isActive
                  ? "bg-green-50 text-green-700 shadow-sm"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }
              `
              }
            >
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Footer */}
        <div className="px-4 py-3 md:py-2.5 lg:py-4 border-t border-gray-200 bg-gray-50/60">
          {user ? (
            <div className="flex items-center gap-3 md:gap-2.5 lg:gap-4">

              {/* Avatar */}
              <div className="w-9 md:w-8 lg:w-10 h-9 md:h-8 lg:h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 
                      flex items-center justify-center text-white text-sm md:text-xs lg:text-base font-semibold shadow-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-xs lg:text-sm font-semibold text-gray-800 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-3">
              <p className="text-xs text-gray-500">Not logged in</p>
            </div>
          )}
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
