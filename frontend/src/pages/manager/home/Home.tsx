import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import HomeHeader from "./HomeHeader";
import HomeStats from "./HomeStats";
import RecentProjects from "./RecentProjects";
import RecentIssues from "./RecentIssues";

import { dashboardApi } from "../../../services/api";
import { DashboardData } from "../../../services/api/types";

/* ======================================================
   Home Dashboard (Enhanced & Interactive)
====================================================== */

const Home = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ======================================================
     Fetch Dashboard Data
  ====================================================== */
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardApi.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
      setError("Unable to load dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  /* ======================================================
     Loading State
  ====================================================== */
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-[3px] border-gray-200 border-t-indigo-500 mx-auto" />
          <p className="mt-3 text-xs text-gray-500 tracking-wide">
            Loading your workspace…
          </p>
        </div>
      </div>
    );
  }

  /* ======================================================
     Error State
  ====================================================== */
  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-md border border-red-200 rounded-xl p-5 text-center max-w-sm w-full shadow-sm">
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* ======================================================
     Main Dashboard
  ====================================================== */
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="min-h-screen"
    >
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Header */}
        <HomeHeader />

        {/* Stats */}
        {dashboardData?.stats && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <HomeStats stats={dashboardData.stats} />
          </motion.div>
        )}

        {/* Projects & Issues */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
          <AnimatePresence>
            {dashboardData?.recent_projects && (
              <motion.div
                key="recent-projects"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.15 }}
              >
                <div className="h-full">
                  <RecentProjects projects={dashboardData.recent_projects} />
                </div>
              </motion.div>
            )}

            {dashboardData?.recent_issues && (
              <motion.div
                key="recent-issues"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="h-full">
                  <RecentIssues issues={dashboardData.recent_issues} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </section>
    </motion.div>
  );
};

export default Home;
