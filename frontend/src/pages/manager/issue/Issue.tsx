import { useEffect, useMemo, useState } from "react";
import {
  Bug,
  Search,
  Plus,
  Calendar,
  User,
  Filter,
  ChevronDown,
  MoreHorizontal,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

/* ======================================================
   Types
====================================================== */

type IssueStatus =
  | "completed"
  | "hold"
  | "to do"
  | "in progress"
  | "canceled";

type IssuePriority = "high" | "medium" | "low";

type IssueType = "bug" | "feature" | "task";

interface Issue {
  id: number;
  title: string;
  type: IssueType;
  status: IssueStatus;
  priority: IssuePriority;
  description: string;
  assignee: string;
  project: string;
  created: string;
}

/* ======================================================
   Helpers
====================================================== */

const getStatusColor = (status: IssueStatus) => {
  const map: Record<IssueStatus, string> = {
    completed: "bg-green-100 text-green-800 border border-green-200",
    hold: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    "to do": "bg-blue-100 text-blue-800 border border-blue-200",
    "in progress": "bg-purple-100 text-purple-800 border border-purple-200",
    canceled: "bg-red-100 text-red-800 border border-red-200",
  };
  return map[status];
};

const getPriorityColor = (priority: IssuePriority) => {
  const map: Record<IssuePriority, string> = {
    high: "bg-red-100 text-red-800 border border-red-200",
    medium: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    low: "bg-green-100 text-green-800 border border-green-200",
  };
  return map[priority];
};

const getTypeIcon = (type: IssueType) => {
  switch (type) {
    case "bug":
      return <AlertTriangle size={14} />;
    case "feature":
      return <CheckCircle size={14} />;
    case "task":
      return <Clock size={14} />;
    default:
      return <Bug size={14} />;
  }
};

/* ======================================================
   Component
====================================================== */

const Issue = () => {
  const [allIssues, setAllIssues] = useState<Issue[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<IssueStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] =
    useState<IssuePriority | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ================= Mock Data (Replace with API later) ================= */

  useEffect(() => {
    try {
      setLoading(true);

      const mockIssues: Issue[] = [
        {
          id: 1,
          title: "Fix Login Page Error",
          type: "bug",
          status: "in progress",
          priority: "high",
          description:
            "Users are unable to login with valid credentials after password validation.",
          assignee: "John Smith",
          project: "Website Redesign",
          created: "2 hours ago",
        },
        {
          id: 2,
          title: "Add Dark Mode Feature",
          type: "feature",
          status: "to do",
          priority: "medium",
          description:
            "Implement dark mode toggle in user preferences section.",
          assignee: "Unassigned",
          project: "Mobile App",
          created: "1 day ago",
        },
        {
          id: 3,
          title: "Update Documentation",
          type: "task",
          status: "completed",
          priority: "low",
          description: "Update API documentation with latest endpoints.",
          assignee: "Emily Johnson",
          project: "API Integration",
          created: "3 days ago",
        },
      ];

      setAllIssues(mockIssues);
      setError(null);
    } catch {
      setError("Failed to load issues.");
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================= Filtering ================= */

  const filteredIssues = useMemo(() => {
    return allIssues.filter((issue) => {
      const matchSearch =
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.project.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        statusFilter === "all" || issue.status === statusFilter;

      const matchPriority =
        priorityFilter === "all" || issue.priority === priorityFilter;

      return matchSearch && matchStatus && matchPriority;
    });
  }, [allIssues, searchTerm, statusFilter, priorityFilter]);

  /* ================= States ================= */

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading issues...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        {error}
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="space-y-6 p-2">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Issues</h1>
            <p className="text-sm text-gray-600 mt-1">
              Track and manage all project issues
            </p>
          </div>

          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm font-medium flex items-center gap-2">
            <Plus size={16} />
            New Issue
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search issues..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as IssueStatus | "all")
              }
              className="appearance-none pl-3 pr-8 py-2 border rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="hold">Hold</option>
              <option value="to do">To Do</option>
              <option value="in progress">In Progress</option>
              <option value="canceled">Canceled</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Priority */}
          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value as IssuePriority | "all")
              }
              className="appearance-none pl-3 pr-8 py-2 border rounded-lg"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <button className="px-3 py-2 border rounded-lg flex items-center gap-2">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      {/* Issue List */}
      <div className="space-y-4">
        {filteredIssues.map((issue) => (
          <div
            key={issue.id}
            className="bg-white border rounded-lg p-4 hover:shadow-md transition"
          >
            <div className="flex justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-2">
                  <div className="p-1.5 rounded bg-blue-100 text-blue-600">
                    {getTypeIcon(issue.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{issue.title}</h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(
                          issue.priority
                        )}`}
                      >
                        {issue.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {issue.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  <span className={getStatusColor(issue.status)}>
                    {issue.status}
                  </span>
                  <span className="flex items-center gap-1">
                    <User size={10} />
                    {issue.assignee}
                  </span>
                  <span>{issue.project}</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    {issue.created}
                  </span>
                </div>
              </div>

              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredIssues.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Bug size={48} className="mx-auto mb-3 opacity-40" />
          No issues found
        </div>
      )}
    </div>
  );
};

export default Issue;
