import {
  Folder,
  CheckSquare,
  Calendar,
  Users,
  Plus,
  Minus,
} from "lucide-react";
import { motion } from "framer-motion";
import { DashboardStats } from "../../../services/api/types";

/* ======================================================
   Types
====================================================== */

type TrendType = "neutral" | "up" | "down";
type ColorTheme = "blue" | "orange" | "green" | "purple";

interface StatCardProps {
  title: string;
  value: number;
  trend: number;
  trendType: TrendType;
  icon: React.ElementType;
  colorTheme: ColorTheme;
}

/* ======================================================
   Helpers
====================================================== */

const getTrendType = (val: number): TrendType =>
  val > 0 ? "up" : val < 0 ? "down" : "neutral";

const themes: Record<
  ColorTheme,
  {
    bg: string;
    text: string;
    accent: string;
    glow: string;
  }
> = {
  blue: {
    bg: "bg-blue-50/70",
    text: "text-blue-600",
    accent: "from-blue-500 to-blue-400",
    glow: "hover:shadow-blue-200/40",
  },
  orange: {
    bg: "bg-orange-50/70",
    text: "text-orange-600",
    accent: "from-orange-500 to-orange-400",
    glow: "hover:shadow-orange-200/40",
  },
  green: {
    bg: "bg-emerald-50/70",
    text: "text-emerald-600",
    accent: "from-emerald-500 to-emerald-400",
    glow: "hover:shadow-emerald-200/40",
  },
  purple: {
    bg: "bg-purple-50/70",
    text: "text-purple-600",
    accent: "from-purple-500 to-purple-400",
    glow: "hover:shadow-purple-200/40",
  },
};

/* ======================================================
   Stat Card (Premium + Interactive)
====================================================== */

const StatCard = ({
  title,
  value,
  trend,
  trendType,
  icon: Icon,
  colorTheme,
}: StatCardProps) => {
  const theme = themes[colorTheme];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`
        relative overflow-hidden
        bg-white/70 backdrop-blur-md
        border border-gray-200/60
        rounded-xl p-4
        cursor-pointer
        transition-all duration-200
        hover:shadow-lg ${theme.glow}
      `}
    >
      {/* Accent Strip */}
      <div
        className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${theme.accent}`}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-11 h-11 rounded-lg flex items-center justify-center ${theme.bg} ${theme.text}`}
        >
          <Icon size={20} strokeWidth={2.2} />
        </div>

        <div
          className={`flex items-center gap-1 px-2.5 py-1
            rounded-full text-xs font-semibold
            ${
              trendType === "up"
                ? "bg-green-50 text-green-700"
                : trendType === "down"
                ? "bg-red-50 text-red-700"
                : "bg-gray-100 text-gray-600"
            }`}
        >
          {trendType === "up" && <Plus size={12} />}
          {trendType === "down" && <Minus size={12} />}
          {trendType === "neutral" && <Minus size={12} />}
          <span>{Math.abs(trend)}%</span>
        </div>
      </div>

      {/* Value */}
      <motion.h3
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
        className="text-3xl font-semibold text-gray-900 leading-none"
      >
        {value.toLocaleString()}
      </motion.h3>

      {/* Label */}
      <p className="mt-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
        {title}
      </p>
    </motion.div>
  );
};

/* ======================================================
   Main Component
====================================================== */

interface HomeStatsProps {
  stats: DashboardStats;
}

const HomeStats = ({ stats }: HomeStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        title="My Projects"
        value={stats.total_projects}
        trend={stats.projects_trend ?? 0}
        trendType={getTrendType(stats.projects_trend ?? 0)}
        icon={Folder}
        colorTheme="blue"
      />

      <StatCard
        title="Active Issues"
        value={stats.active_issues}
        trend={stats.issues_trend ?? 0}
        trendType={getTrendType(stats.issues_trend ?? 0)}
        icon={CheckSquare}
        colorTheme="orange"
      />

      <StatCard
        title="Active Sprints"
        value={stats.active_sprints}
        trend={stats.sprints_trend ?? 0}
        trendType={getTrendType(stats.sprints_trend ?? 0)}
        icon={Calendar}
        colorTheme="green"
      />

      <StatCard
        title="Team Members"
        value={stats.team_members}
        trend={stats.members_trend ?? 0}
        trendType={getTrendType(stats.members_trend ?? 0)}
        icon={Users}
        colorTheme="purple"
      />
    </div>
  );
};

export default HomeStats;
