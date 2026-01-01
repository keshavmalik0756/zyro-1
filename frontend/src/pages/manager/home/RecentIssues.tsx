import {
  Bug,
  AlertCircle,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RecentIssue } from "../../../services/api/types";
import AssigneeAvatar from "../../../components/custom/AssigneeAvatar";

/* ======================================================
   Helpers
====================================================== */

const getProjectKey = (projectName: string): string => {
  const words = projectName.trim().split(/\s+/);
  return words.length === 1
    ? words[0].slice(0, 2).toUpperCase()
    : words.map((w) => w[0]).join("").toUpperCase();
};

const getIssueKey = (project: string, id: number | string): string =>
  `${getProjectKey(project)}-${id}`;

const getStatusPill = (status: string): string => {
  switch (status.toLowerCase()) {
    case "canceled":
      return "bg-red-50 text-red-700";
    case "in progress":
      return "bg-blue-50 text-blue-700";
    case "to do":
      return "bg-green-50 text-green-700";
    case "hold":
      return "bg-yellow-50 text-yellow-700";
    case "completed":
      return "bg-purple-50 text-purple-700";
    default:
      return "bg-gray-50 text-gray-600";
  }
};

const getPriorityColor = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-50 text-red-600";
    case "medium":
      return "bg-yellow-50 text-yellow-700";
    case "low":
      return "bg-blue-50 text-blue-600";
    default:
      return "bg-gray-50 text-gray-600";
  }
};

const formatTimeAgo = (timeString: string): string => {
  // Parse "Xh ago" format
  const match = timeString.match(/(\d+)h\s+ago/);
  if (!match) return timeString;

  const hours = parseInt(match[1], 10);

  // Hours
  if (hours < 24) {
    return `${hours}h ago`;
  }

  // Days
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return days === 1 ? "1d ago" : `${days}d ago`;
  }

  // Weeks
  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return weeks === 1 ? "1w ago" : `${weeks}w ago`;
  }

  // Months
  const months = Math.floor(days / 30);
  if (months < 12) {
    return months === 1 ? "1mo ago" : `${months}mo ago`;
  }

  // Years
  const years = Math.floor(days / 365);
  return years === 1 ? "1y ago" : `${years}y ago`;
};

/* ======================================================
   Issue Item
====================================================== */

interface IssueItemProps {
  issue: RecentIssue;
  onClick: () => void;
}

const IssueItem = ({ issue, onClick }: IssueItemProps) => (
  <motion.li
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -3 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    onClick={onClick}
    className="
      group relative cursor-pointer
      bg-white/70 backdrop-blur-md
      border border-gray-200/60 rounded-xl p-3
      transition-all duration-200
      hover:border-blue-300 hover:shadow-md
    "
  >
    <div className="flex items-start gap-3">
      {/* Badge */}
      <div className="flex-shrink-0 pt-0.5">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-blue-600 text-xs font-bold">
          {getIssueKey(issue.project, issue.id)}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-medium text-gray-900 truncate">
            {issue.title}
          </h3>

          <ChevronRight
            size={16}
            className="text-gray-400 opacity-0 group-hover:opacity-100 transition flex-shrink-0"
          />
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2 mt-1.5 max-lg:text-xs">
          <span className="text-xs text-gray-500 truncate">
            {issue.project}
          </span>

          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${getPriorityColor(
              issue.priority
            )}`}
          >
            {issue.priority}
          </span>

          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusPill(
              issue.status
            )}`}
          >
            {issue.status}
          </span>
        </div>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AssigneeAvatar name={issue.assignee} />
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {formatTimeAgo(issue.created)}
          </span>
        </div>
      </div>
    </div>
  </motion.li>
);

/* ======================================================
   Main Component
====================================================== */

interface RecentIssuesProps {
  issues?: RecentIssue[];
  loading?: boolean;
  error?: string | null;
}

const RecentIssues: React.FC<RecentIssuesProps> = ({
  issues = [],
  loading = false,
  error = null,
}) => {
  const navigate = useNavigate();
  const visibleIssues = issues.slice(0, 4);

  return (
    <div className="bg-white/70 backdrop-blur-md border border-gray-200/60 rounded-xl p-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Bug size={16} />
          </span>
          Recent Issues
        </h2>

        <button
          onClick={() => navigate("/issues")}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          View all
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {loading && (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <Loader2 size={20} className="animate-spin mb-2 text-blue-500" />
            <p className="text-sm">Loading issues…</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center h-40 text-red-500">
            <AlertCircle size={20} className="mb-2" />
            <p className="text-sm text-center">{error}</p>
          </div>
        )}

        {!loading && !error && visibleIssues.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <Bug size={20} className="mb-2 opacity-50" />
            <p className="text-sm">No recent issues</p>
          </div>
        )}

        {!loading && !error && visibleIssues.length > 0 && (
          <ul className="space-y-3">
            {visibleIssues.map((issue, index) => (
              <IssueItem
                key={issue.id ?? `issue-${index}`}
                issue={issue}
                onClick={() => navigate(`/issues/${issue.id}`)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RecentIssues;
