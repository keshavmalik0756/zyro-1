import { Bug, AlertCircle, Loader2, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RecentIssue } from "../../../services/api/types";
import AssigneeAvatar from "../../../components/custom/AssigneeAvatar";

/* ======================================================
   Helpers
====================================================== */

const getProjectKey = (projectName: string) => {
  const words = projectName.trim().split(/\s+/);
  return words.length === 1
    ? words[0].slice(0, 2).toUpperCase()
    : words.map((w) => w[0]).join("").toUpperCase();
};

const getIssueKey = (project: string, id: number | string) =>
  `${getProjectKey(project)}-${id}`;

const getStatusPill = (status: string) => {
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

const getPriorityColor = (priority: string) => {
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

/* ======================================================
   Issue Item
====================================================== */

interface IssueItemProps {
  issue: RecentIssue;
}

const IssueItem = ({ issue }: IssueItemProps) => {
  const navigate = useNavigate();

  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={() => navigate(`/issues/${issue.id}`)}
      className="
        group relative
        bg-white/70 backdrop-blur-md
        border border-gray-200/60 rounded-xl p-3
        cursor-pointer transition-all duration-200
        hover:border-blue-300 hover:shadow-md
      "
    >
      {/* Top Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-blue-600">
              {getIssueKey(issue.project, issue.id)}
            </span>

            <h3 className="text-sm font-medium text-gray-900 truncate">
              {issue.title}
            </h3>
          </div>

          <p className="text-[11px] text-gray-500 mt-0.5 truncate">
            {issue.project}
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-gray-400 whitespace-nowrap">
          <AssigneeAvatar name={issue.assignee} />
          <span>{issue.created}</span>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${getPriorityColor(
              issue.priority
            )}`}
          >
            {issue.priority}
          </span>

          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${getStatusPill(
              issue.status
            )}`}
          >
            {issue.status}
          </span>
        </div>

        <ChevronRight
          size={14}
          className="text-gray-400 opacity-0 group-hover:opacity-100 transition"
        />
      </div>
    </motion.li>
  );
};

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

  return (
    <div className="bg-white/70 backdrop-blur-md border border-gray-200/60 rounded-xl p-4 flex flex-col h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <Bug size={14} />
          </span>
          Recent Issues
        </h2>

        <button
          onClick={() => navigate("/issues")}
          className="text-xs font-medium text-blue-600 hover:underline"
        >
          View all
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {loading && (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <Loader2 size={18} className="animate-spin mb-2 text-blue-500" />
            <p className="text-xs">Loading issues…</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center h-40 text-red-500">
            <AlertCircle size={18} className="mb-2" />
            <p className="text-xs text-center">{error}</p>
          </div>
        )}

        {!loading && !error && issues.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <Bug size={18} className="mb-2 opacity-50" />
            <p className="text-xs">No recent issues</p>
          </div>
        )}

        {!loading && !error && issues.length > 0 && (
          <ul className="space-y-3">
            {issues.slice(0, 4).map((issue) => (
              <IssueItem key={issue.id} issue={issue} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RecentIssues;
