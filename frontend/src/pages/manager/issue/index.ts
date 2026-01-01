// Main component
export { default as Issues } from './Issue';

// Hooks
export { useIssues } from './hooks/useIssues';
export { useIssueFilters } from './hooks/useIssueFilters';
export { useIssueDragDrop } from './hooks/useIssueDragDrop';

// Components
export { IssueHeader } from './components/IssueHeader';
export { IssueBoard } from './components/IssueBoard';
export { IssueList } from './components/IssueList';
export { IssueCard } from './components/IssueCard';
export { IssueColumn } from './components/IssueColumn';
export { IssueModal } from './components/IssueModal';
export { DeleteConfirmModal } from './components/DeleteConfirmModal';

// Constants
export { statuses, priorities, types, priorityMap } from './constants/issueConfig';

// Types
export type { UIIssue } from './hooks/useIssues';
