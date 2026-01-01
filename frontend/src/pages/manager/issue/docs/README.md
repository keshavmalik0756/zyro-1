# Issue Management Module - Refactored Architecture

## Overview
The Issue module has been refactored from a single 1000+ line component into a modular, efficient architecture with separated concerns. This improves maintainability, testability, and performance.

## Directory Structure

```
frontend/src/pages/manager/issue/
├── Issue.tsx                    # Main orchestrator component
├── README.md                    # This file
├── hooks/
│   ├── useIssues.ts            # Data fetching & state management
│   ├── useIssueFilters.ts       # Search & filter logic
│   └── useIssueDragDrop.ts      # Drag-drop functionality
├── components/
│   ├── IssueHeader.tsx          # Header with toolbar
│   ├── IssueBoard.tsx           # Kanban board view
│   ├── IssueList.tsx            # Table/list view
│   ├── IssueCard.tsx            # Draggable issue card
│   ├── IssueColumn.tsx          # Kanban column
│   ├── IssueModal.tsx           # Create/edit modal
│   └── DeleteConfirmModal.tsx   # Delete confirmation
└── constants/
    └── issueConfig.ts           # Statuses, priorities, types config
```

## Key Components

### Hooks

#### `useIssues.ts`
Manages all data fetching and state for issues and projects.

**Exports:**
- `useIssues()` - Main hook
  - `issues` - Array of UI issues
  - `projects` - Array of projects
  - `isLoading` - Loading state
  - `loadData()` - Refresh data
  - `updateIssueStatus()` - Update issue status
  - `deleteIssue()` - Delete an issue

**Features:**
- Transforms API issues to UI format
- Handles project mapping
- Error handling with toast notifications
- Optimistic updates for status changes

#### `useIssueFilters.ts`
Handles search and filtering logic with memoization.

**Exports:**
- `useIssueFilters(issues)` - Main hook
  - `searchQuery` - Current search term
  - `setSearchQuery()` - Update search
  - `selectedFilter` - Current filter
  - `setSelectedFilter()` - Update filter
  - `filteredIssues` - Filtered results
  - `issuesByStatus` - Issues grouped by status

**Features:**
- Real-time search across title, ID, and project
- Status filtering
- "My Issues" filter
- Memoized computations for performance

#### `useIssueDragDrop.ts`
Manages drag-and-drop functionality.

**Exports:**
- `useIssueDragDrop(issues, onStatusChange)` - Main hook
  - `activeId` - Currently dragged item ID
  - `activeIssue` - Currently dragged issue
  - `handleDragStart()` - Drag start handler
  - `handleDragEnd()` - Drag end handler

**Features:**
- Handles drag start/end events
- Updates issue status on drop
- Validates drop targets

### Components

#### `IssueHeader.tsx`
Header with search, filters, and view toggle.

**Props:**
- `searchQuery` - Current search term
- `onSearchChange` - Search change handler
- `selectedFilter` - Current filter
- `onFilterChange` - Filter change handler
- `selectedView` - Current view (board/list)
- `onViewChange` - View change handler
- `onCreateClick` - Create button handler

#### `IssueBoard.tsx`
Kanban board view with drag-and-drop.

**Props:**
- `issuesByStatus` - Issues grouped by status
- `activeIssue` - Currently dragged issue
- `sensors` - DnD sensors
- `onDragStart` - Drag start handler
- `onDragEnd` - Drag end handler
- `onEdit` - Edit handler
- `onDelete` - Delete handler

#### `IssueList.tsx`
Table/list view of issues.

**Props:**
- `issues` - Array of issues to display
- `onEdit` - Edit handler
- `onDelete` - Delete handler

#### `IssueCard.tsx`
Individual draggable issue card.

**Props:**
- `issue` - Issue data
- `onEdit` - Edit handler
- `onDelete` - Delete handler

**Features:**
- Drag handle with visual feedback
- Context menu (edit/delete)
- Priority and story points display
- Assignee avatar

#### `IssueColumn.tsx`
Kanban column for a specific status.

**Props:**
- `statusKey` - Status identifier
- `issues` - Issues in this column
- `onEdit` - Edit handler
- `onDelete` - Delete handler

#### `IssueModal.tsx`
Create/edit issue modal.

**Props:**
- `isOpen` - Modal visibility
- `onClose` - Close handler
- `issue` - Issue to edit (null for create)
- `projects` - Available projects
- `onSave` - Save handler

**Features:**
- Form validation
- Project selection
- Sprint assignment
- Assignee selection
- Priority and story points
- Status editing (edit mode only)

#### `DeleteConfirmModal.tsx`
Delete confirmation dialog.

**Props:**
- `isOpen` - Modal visibility
- `onClose` - Close handler
- `issue` - Issue to delete
- `onConfirm` - Confirm handler

### Constants

#### `issueConfig.ts`
Centralized configuration for statuses, priorities, and issue types.

**Exports:**
- `statuses` - Status configurations with colors and icons
- `priorities` - Priority configurations
- `types` - Issue type configurations
- `priorityMap` - Frontend to backend priority mapping

## Main Component (Issue.tsx)

The main component orchestrates all hooks and components:

1. **Data Loading** - Uses `useIssues` hook
2. **Filtering** - Uses `useIssueFilters` hook
3. **Drag-Drop** - Uses `useIssueDragDrop` hook
4. **View Management** - Toggles between board and list views
5. **Modal Management** - Handles create, edit, and delete modals

## Performance Optimizations

1. **Memoization** - Filters use `useMemo` to prevent unnecessary recalculations
2. **Lazy Rendering** - Components only render when needed
3. **Optimistic Updates** - Status changes update UI immediately
4. **Efficient Re-renders** - Hooks prevent unnecessary component updates
5. **Virtualization Ready** - List view can be enhanced with virtualization

## Data Flow

```
Issue.tsx (Orchestrator)
    ↓
useIssues (Data)
    ↓
useIssueFilters (Filter)
    ↓
useIssueDragDrop (Drag-Drop)
    ↓
Components (UI)
    ├── IssueHeader
    ├── IssueBoard
    │   ├── IssueColumn
    │   └── IssueCard
    ├── IssueList
    ├── IssueModal
    └── DeleteConfirmModal
```

## Usage Example

```typescript
import Issues from '@/pages/manager/issue/Issue';

// Use in routing
<Route path="/issues" element={<Issues />} />
```

## Future Enhancements

1. **Virtualization** - Add react-window for large lists
2. **Advanced Filters** - Add more filter options
3. **Sorting** - Add sorting by name, date, priority
4. **Bulk Actions** - Select and act on multiple issues
5. **Export** - Export issues to CSV/PDF
6. **Favorites** - Mark issues as favorites
7. **Recent Issues** - Show recently viewed issues
8. **Keyboard Shortcuts** - Add keyboard navigation
9. **Undo/Redo** - Add undo/redo functionality
10. **Caching** - Add data caching layer

## Testing

Each component and hook can be tested independently:

```typescript
// Test hook
import { renderHook, act } from '@testing-library/react';
import { useIssues } from './hooks/useIssues';

test('useIssues loads data', async () => {
  const { result } = renderHook(() => useIssues());
  await act(async () => {
    await result.current.loadData();
  });
  expect(result.current.issues.length).toBeGreaterThan(0);
});

// Test component
import { render, screen } from '@testing-library/react';
import { IssueCard } from './components/IssueCard';

test('IssueCard renders issue', () => {
  const issue = { /* mock issue */ };
  render(<IssueCard issue={issue} onEdit={() => {}} onDelete={() => {}} />);
  expect(screen.getByText(issue.title)).toBeInTheDocument();
});
```

## Migration Notes

- All functionality from the original Issue.tsx is preserved
- No breaking changes to the API
- Same user experience
- Better code organization and maintainability
- Easier to add new features

## Troubleshooting

### Issues not loading
- Check browser console for errors
- Verify API endpoints are correct
- Check authentication token

### Drag-drop not working
- Ensure @dnd-kit packages are installed
- Check browser console for errors
- Verify sensors are properly configured

### Modals not appearing
- Check z-index values
- Verify modal state is being set correctly
- Check for CSS conflicts
