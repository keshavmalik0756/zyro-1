import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { IssueStatus } from "@/services/api/issueApi";
import { UIIssue } from "../hooks/useIssues";
import { IssueCard } from "./IssueCard";
import { statuses } from "../constants/issueConfig";

interface IssueColumnProps {
  statusKey: IssueStatus;
  issues: UIIssue[];
  onEdit: (issue: UIIssue) => void;
  onDelete: (issue: UIIssue) => void;
}

export const IssueColumn = ({
  statusKey,
  issues,
  onEdit,
  onDelete,
}: IssueColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: statusKey });
  const status = statuses[statusKey];
  const StatusIcon = status.icon;

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-72 bg-[#F4F5F7] rounded border flex flex-col transition-colors ${
        isOver ? "border-[#0052CC] bg-blue-50" : "border-transparent"
      }`}
      style={{
        height: "600px",
        maxHeight: "calc(100vh - 150px)",
        minHeight: "500px",
      }}
    >
      {/* Column Header */}
      <div className="px-3 py-2.5 flex items-center justify-between flex-shrink-0 border-b border-[#DFE1E6] bg-white">
        <div className="flex items-center gap-2">
          <StatusIcon className="w-4 h-4" style={{ color: status.color }} />
          <h3 className="font-semibold text-[#172B4D] text-xs uppercase tracking-wide">
            {status.label}
          </h3>
          <span className="text-xs font-medium text-[#6B778C] bg-[#F4F5F7] px-1.5 py-0.5 rounded">
            {issues.length}
          </span>
        </div>
      </div>

      {/* Issues List */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <SortableContext
          items={issues.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div
            className="h-full overflow-y-auto overflow-x-hidden p-2 space-y-2 issue-column-scroll"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollBehavior: "smooth",
              scrollbarWidth: "thin",                 // Firefox
              scrollbarColor: "#9CA3AF transparent",  // Firefox
            }}
          >
            {issues.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#6B778C]">
                No issues
              </div>
            ) : (
              issues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};
