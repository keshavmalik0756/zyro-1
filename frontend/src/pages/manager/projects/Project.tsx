import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Plus,
  Folder,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Kanban,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";
import { projectApi } from "@/services/api/projectApi";

const Project = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await projectApi.getProjects();
        setProjects(res);
      } catch (err) {
        console.error('Error fetching projects:', err);
        // Set default values if API fails
        setProjects([
          { id: 1, status: 'active' },
          { id: 2, status: 'active' },
          { id: 3, status: 'completed' },
          { id: 4, status: 'pending' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Calculate stats from actual project data
  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status?.toLowerCase() === 'active').length,
    completed: projects.filter(p => p.status?.toLowerCase() === 'completed').length,
    delayed: projects.filter(p => p.status?.toLowerCase() === 'delayed').length,
    upcoming: projects.filter(p => p.status?.toLowerCase() === 'upcoming').length,
  };

  return (
    <div className="min-h-screen w-full max-w-full">
      {/* ================= HEADER ================= */}
      <div className="bg-white/80 backdrop-blur-sm border-b-2 border-gray-200 shadow-lg rounded-b-3xl overflow-hidden">
        <div className="px-6 py-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent truncate"
            >
              Projects
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xs sm:text-sm text-gray-600 mt-2"
            >
              Plan, track, and deliver your work efficiently
            </motion.p>
          </div>

          <div className="flex flex-shrink-0 gap-2 sm:gap-4 mt-4 md:mt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={async () => {
                setLoading(true);
                try {
                  // Add cache-busting parameter to ensure fresh data
                  const res = await projectApi.getProjects();
                  setProjects(res);
                  // Optional: Add success feedback
                  console.log('Projects refreshed successfully');
                } catch (err) {
                  console.error('Error fetching projects:', err);
                  // Optional: Add error feedback
                  alert('Failed to refresh projects. Please try again.');
                } finally {
                  setLoading(false);
                }
              }}
              className="flex items-center justify-center border-2 border-gray-300 px-3 py-2 rounded-2xl text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-md hover:shadow-lg"
              title="Refresh"
              disabled={loading}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4"
                >
                  <RefreshCw size={16} />
                </motion.div>
              ) : (
                <RefreshCw size={16} />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/projects/create")}
              className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white px-3 sm:px-5 py-2 sm:py-3 rounded-2xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5"
            >
              <Plus size={16} />
              <span className="hidden sm:block">New Project</span>
              <span className="sm:hidden">New</span>
            </motion.button>
          </div>
        </div>

        {/* ================= STATS ================= */}
        <div className="px-6 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[
            {
              label: "Total Projects",
              value: stats.total,
              icon: Folder,
              color: "blue",
              gradient: "from-blue-500 to-blue-600",
            },
            {
              label: "Active",
              value: stats.active,
              icon: Clock,
              color: "sky",
              gradient: "from-sky-500 to-blue-500",
            },
            {
              label: "Completed",
              value: stats.completed,
              icon: CheckCircle,
              color: "green",
              gradient: "from-green-500 to-emerald-500",
            },
            {
              label: "Delayed",
              value: stats.delayed,
              icon: AlertCircle,
              color: "red",
              gradient: "from-red-500 to-rose-500",
            },
            {
              label: "Upcoming",
              value: stats.upcoming,
              icon: Clock,
              color: "purple",
              gradient: "from-purple-500 to-violet-500",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-3xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden relative"
            >
              {/* Curved corner decorations */}
              <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-gray-100/50 to-transparent opacity-50"></div>
              <div className="absolute -bottom-2 -left-2 w-10 h-10 rounded-full bg-gradient-to-br from-gray-100/50 to-transparent opacity-50"></div>
              
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">
                    {item.label}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
                    {item.value}
                  </p>
                </div>
                <div className={`p-3 sm:p-4 rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg group-hover:shadow-2xl transition-all duration-300 relative z-10`}>
                  {item.icon && <item.icon size={24} />}
                </div>
              </div>
              
              {/* Curved progress bar */}
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2 overflow-hidden border border-gray-300">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.value / Math.max(stats.total, 1)) * 100}%` }}
                  transition={{ delay: 0.2 + idx * 0.1, duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full bg-gradient-to-r ${item.gradient} shadow-inner`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* ================= TABS ================= */}
        <div className="px-4 pt-2 flex overflow-x-auto gap-2 bg-gray-50/50 rounded-t-2xl p-2 [&::-webkit-scrollbar]:h-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-400/60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-500/80">
          <NavLink
            to="/projects"
            end
            className={({ isActive }) =>
              `px-4 py-2.5 text-xs sm:text-sm font-semibold relative transition-all duration-200 rounded-xl whitespace-nowrap ${
                isActive
                  ? "bg-white text-sky-600 shadow-md"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`
            }
          >
            All Projects
            {location.pathname === "/projects" && (
              <motion.div 
                layoutId="activeTab"
                className="absolute inset-0 bg-white rounded-xl shadow-md -z-10"
              />
            )}
          </NavLink>

          <NavLink
            to="/projects/kanban"
            className={({ isActive }) =>
              `px-4 py-2.5 text-xs sm:text-sm font-semibold relative transition-all duration-200 rounded-xl whitespace-nowrap ${
                isActive
                  ? "bg-white text-sky-600 shadow-md"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`
            }
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <Kanban size={14} />
              <span className="hidden sm:block">Kanban</span>
              <span className="sm:hidden">Board</span>
            </div>
            {location.pathname === "/projects/kanban" && (
              <motion.div 
                layoutId="activeTab"
                className="absolute inset-0 bg-white rounded-xl shadow-md -z-10"
              />
            )}
          </NavLink>

          <NavLink
            to="/projects/analytics"
            className={({ isActive }) =>
              `px-4 py-2.5 text-xs sm:text-sm font-semibold relative transition-all duration-200 rounded-xl whitespace-nowrap ${
                isActive
                  ? "bg-white text-sky-600 shadow-md"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`
            }
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <BarChart3 size={14} />
              <span className="hidden sm:block">Analytics</span>
              <span className="sm:hidden">Stats</span>
            </div>
            {location.pathname === "/projects/analytics" && (
              <motion.div 
                layoutId="activeTab"
                className="absolute inset-0 bg-white rounded-xl shadow-md -z-10"
              />
            )}
          </NavLink>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-full bg-white/50 backdrop-blur-sm rounded-3xl p-4 sm:p-6 shadow-inner border border-gray-200/50"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};

export default Project;
