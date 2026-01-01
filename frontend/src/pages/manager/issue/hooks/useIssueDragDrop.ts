import { useState, useCallback } from "react";
import { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { IssueStatus } from "@/services/api/types";
import { UIIssue } from "./useIssues";
import { statuses } from "../constants/issueConfig";

export const useIssueDragDrop = (
  issues: UIIssue[],
  onStatusChange: (issueId: string, newStatus: IssueStatus) => Promise<boolean>
) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over) return;

      const issueId = active.id as string;
      let newStatus: IssueStatus | null = null;

      // Check if the drop target is a status column
      if (Object.keys(statuses).includes(over.id as string)) {
        newStatus = over.id as IssueStatus;
      } else {
        // If dropping on an issue card, use the status of that issue
        const targetIssue = issues.find((i) => i.id === over.id);
        if (targetIssue) {
          newStatus = targetIssue.status;
        } else {
          return;
        }
      }

      const issue = issues.find((i) => i.id === issueId);
      if (!issue || !newStatus || issue.status === newStatus) return;

      await onStatusChange(issueId, newStatus);
    },
    [issues, onStatusChange]
  );

  const activeIssue = activeId ? (issues.find((i) => i.id === activeId) || null) : null;

  return {
    activeId,
    activeIssue,
    handleDragStart,
    handleDragEnd,
  };
};
