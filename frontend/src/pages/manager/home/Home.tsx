import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import HomeHeader from "./HomeHeader";
import HomeStats from "./HomeStats";
import RecentProjects from "./RecentProjects";
import RecentIssues from "./RecentIssues";

import { dashboardApi } from "../../../services/api";
import { DashboardData } from "../../../services/api/types";

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const ANIMATION_VARIANTS = {
  container: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  },
  stats: {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.1 },
  },
  gridItem: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 },
  },
  projects: {
    transition: { delay: 0.15 },
  },
  issues: {
    transition: { delay: 0.2 },
  },
};

// ============================================================================
// LOADING STATE COMPONENT
// ============================================================================

const LoadingState = () => (
  <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50/50">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-10 xs:w-12 h-10 xs:h-12 border-4 border-sky-500 border-t-transparent rounded-full mb-4"
    />
    <p className="text-sm xs:text-base text-gray-600">Loading Manager Dashboard</p>
  </div>
);

// ============================================================================
// ERROR STATE COMPONENT
// ============================================================================

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState = ({ error, onRetry }: ErrorStateProps) => (
  <div className="w-full min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md"
    >
      <div className="bg-white rounded-xl xs:rounded-2xl border border-red-100 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 xs:p-6 border-b border-red-200">
          <div className="flex items-center gap-3">
            <div className="w-10 xs:w-12 h-10 xs:h-12 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 xs:w-7 h-6 xs:h-7 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-base xs:text-lg font-semibold text-red-900">
              Unable to Load Dashboard
            </h3>
          </div>
        </div>
        <div className="p-4 xs:p-6">
          <p className="text-red-700 text-xs xs:text-sm mb-3 xs:mb-4">{error}</p>
          <button
            onClick={onRetry}
            className="w-full px-3 xs:px-4 py-1.5 xs:py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-xs xs:text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    </motion.div>
  </div>
);

// ============================================================================
// DASHBOARD CONTENT COMPONENT
// ============================================================================

interface DashboardContentProps {
  data: DashboardData;
}

const DashboardContent = ({ data }: DashboardContentProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="max-w-full space-y-4 xs:space-y-6"
  >
    {/* Header */}
    <HomeHeader />

    {/* Stats Section */}
    {data.stats && (
      <motion.div
        initial={ANIMATION_VARIANTS.stats.initial}
        animate={ANIMATION_VARIANTS.stats.animate}
        transition={ANIMATION_VARIANTS.stats.transition}
      >
        <HomeStats stats={data.stats} />
      </motion.div>
    )}

    {/* Projects & Issues Grid */}
    <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 xs:gap-5 sm:gap-6 lg:gap-8">
      <AnimatePresence mode="wait">
        {data.recent_projects && (
          <motion.div
            key="recent-projects"
            initial={ANIMATION_VARIANTS.gridItem.initial}
            animate={ANIMATION_VARIANTS.gridItem.animate}
            exit={ANIMATION_VARIANTS.gridItem.exit}
            transition={ANIMATION_VARIANTS.projects.transition}
            className="h-full"
          >
            <RecentProjects projects={data.recent_projects} />
          </motion.div>
        )}

        {data.recent_issues && (
          <motion.div
            key="recent-issues"
            initial={ANIMATION_VARIANTS.gridItem.initial}
            animate={ANIMATION_VARIANTS.gridItem.animate}
            exit={ANIMATION_VARIANTS.gridItem.exit}
            transition={ANIMATION_VARIANTS.issues.transition}
            className="h-full"
          >
            <RecentIssues issues={data.recent_issues} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </motion.div>
);

// ============================================================================
// MAIN HOME COMPONENT
// ============================================================================

const Home = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized fetch function for efficiency
  const fetchDashboardData = useCallback(async () => {
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
  }, []);

  // Fetch data on mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Render states
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchDashboardData} />;
  if (!dashboardData) return <LoadingState />;

  return (
    <div className="w-full max-w-full bg-gray-50/50">
      {/* Content */}
      <div className="">
        <motion.div
          initial={ANIMATION_VARIANTS.container.initial}
          animate={ANIMATION_VARIANTS.container.animate}
          transition={ANIMATION_VARIANTS.container.transition}
          className="px-3 sm:px-4 md:px-5 lg:px-6"
        >
          <DashboardContent data={dashboardData} />
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
