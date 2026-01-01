import {
  Circle,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  PauseCircle,
  FileCheck,
  Ban,
} from "lucide-react";
import { IssueStatus, IssueType } from "@/services/api/types";

export const statuses: Record<
  IssueStatus,
  { label: string; color: string; bgColor: string; icon: any }
> = {
  todo: {
    label: "To Do",
    color: "#42526E",
    bgColor: "#F4F5F7",
    icon: Circle,
  },
  in_progress: {
    label: "In Progress",
    color: "#0052CC",
    bgColor: "#DEEBFF",
    icon: Clock,
  },
  completed: {
    label: "Done",
    color: "#006644",
    bgColor: "#E3FCEF",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "#6B778C",
    bgColor: "#F4F5F7",
    icon: XCircle,
  },
  hold: {
    label: "Hold",
    color: "#FFAB00",
    bgColor: "#FFF4E5",
    icon: PauseCircle,
  },
  qa: {
    label: "QA",
    color: "#6554C0",
    bgColor: "#EAE6FF",
    icon: FileCheck,
  },
  blocked: {
    label: "Blocked",
    color: "#DE350B",
    bgColor: "#FFEBE6",
    icon: Ban,
  },
};

export const priorities = {
  low: { label: "Low", color: "#6B778C", bgColor: "#F4F5F7" },
  medium: { label: "Medium", color: "#FFAB00", bgColor: "#FFF4E5" },
  high: { label: "High", color: "#DE350B", bgColor: "#FFEBE6" },
  critical: { label: "Critical", color: "#BF2600", bgColor: "#FFEBE6" },
};

export const types: Record<
  IssueType | "release" | "documentation" | "other",
  { label: string; color: string; icon: any }
> = {
  story: { label: "Story", color: "#0052CC", icon: Circle },
  task: { label: "Task", color: "#36B37E", icon: CheckCircle2 },
  bug: { label: "Bug", color: "#DE350B", icon: AlertCircle },
  epic: { label: "Epic", color: "#6554C0", icon: Circle },
  subtask: { label: "Subtask", color: "#6B778C", icon: Circle },
  feature: { label: "Feature", color: "#36B37E", icon: Circle },
  release: { label: "Release", color: "#0052CC", icon: Circle },
  documentation: { label: "Documentation", color: "#6B778C", icon: Circle },
  other: { label: "Other", color: "#6B778C", icon: Circle },
};

export const priorityMap: Record<
  string,
  "low" | "moderate" | "high" | "critical"
> = {
  low: "low",
  medium: "moderate",
  high: "high",
  critical: "critical",
};
