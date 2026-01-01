# Issue Module - Quick Reference Guide

## 📁 File Organization

```
issue/
├── Issue.tsx                 ← Main component (start here)
├── index.ts                  ← Clean imports
├── README.md                 ← Full documentation
├── QUICK_REFERENCE.md        ← This file
├── hooks/                    ← Business logic
│   ├── useIssues.ts         ← Data fetching
│   ├── useIssueFilters.ts   ← Search & filter
│   └── useIssueDragDrop.ts  ← Drag-drop
├── components/              ← UI components
│   ├── IssueHeader.tsx      ← Top bar
│   ├── IssueBoard.tsx       ← Kanban view
│   ├── IssueList.tsx        ← Table view
│   ├── IssueCard.tsx        ← Issue card
│   ├── IssueColumn.tsx      ← Kanban column
│   ├── IssueModal.tsx       ← Create/edit
│   └── DeleteConfirmModal.tsx ← Delete
└── constants/
    └── issueConfig.ts       ← Config
```

## 🚀 Quick Start

### Import Main Component
```typescript
import Issues from '@/pages/manager/issue';
```

### Use in Route
```typescript
<Route path="/issues" element={<Issues />} />
```

## 🎣 Hooks Reference

### useIssues()
```typescript
const { 
  issues,              // UIIssue[]
  projects,            // Project[]
  isLoading,           // boolean
  loadData,            // () => Promise<void>
  updateIssueStatus,   // (id, status) => Promise<boolean>
  deleteIssue          // (apiId) => Promise<boolean>
} = useIssues();
```

### useIssueFilters(issues)
```typescript
const {
  searchQuery,         // string
  setSearchQuery,      // (query) => void
  selectedFilter,      // string
  setSelectedFilter,   // (filter) => void
  filteredIssues,      // UIIssue[]
  issuesByStatus       // Record<IssueStatus, UIIssue[]>
} = useIssueFilters(issues);
```

### useIssueDragDrop(issues, onStatusChange)
```typescript
const {
  activeId,            // string | null
  activeIssue,         // UIIssue | null
  handleDragStart,     // (event) => void
  handleDragEnd        // (event) => void
} = useIssueDragDrop(issues, onStatusChange);
```

## 🧩 Component Props

### IssueHeader
```typescript
<IssueHeader
  searchQuery={string}
  onSearchChange={(query) => void}
  selectedFilter={string}
  onFilterChange={(filter) => void}
  selectedView={"board" | "list"}
  onViewChange={(view) => void}
  onCreateClick={() => void}
/>
```

### IssueBoard
```typescript
<IssueBoard
  issuesByStatus={Record<IssueStatus, UIIssue[]>}
  activeIssue={UIIssue | null}
  sensors={any}
  onDragStart={(event) => void}
  onDragEnd={(event) => void}
  onEdit={(issue) => void}
  onDelete={(issue) => void}
/>
```

### IssueList
```typescript
<IssueList
  issues={UIIssue[]}
  onEdit={(issue) => void}
  onDelete={(issue) => void}
/>
```

### IssueCard
```typescript
<IssueCard
  issue={UIIssue}
  onEdit={(issue) => void}
  onDelete={(issue) => void}
/>
```

### IssueColumn
```typescript
<IssueColumn
  statusKey={IssueStatus}
  issues={UIIssue[]}
  onEdit={(issue) => void}
  onDelete={(issue) => void}
/>
```

### IssueModal
```typescript
<IssueModal
  isOpen={boolean}
  onClose={() => void}
  issue={UIIssue | null}
  projects={Project[]}
  onSave={() => void}
/>
```

### DeleteConfirmModal
```typescript
<DeleteConfirmModal
  isOpen={boolean}
  onClose={() => void}
  issue={UIIssue | null}
  onConfirm={() => void}
/>
```

## 📊 Data Types

### UIIssue
```typescript
interface UIIssue {
  id: string;                                    // "PRJ-123"
  title: string;
  type: IssueType;                              // "task" | "bug" | "story" | etc
  priority: "low" | "medium" | "high" | "critical";
  status: IssueStatus;                          // "todo" | "in_progress" | etc
  assignee: { name: string; avatar: string; id?: number };
  reporter: { name: string; avatar: string; id?: number };
  project: { key: string; name: string; id?: number };
  created: string;                              // "2 hours ago"
  updated: string;                              // "Just now"
  labels: string[];
  storyPoints?: number;
  apiId?: number;                               // Backend ID
}
```

### IssueStatus
```typescript
type IssueStatus = 
  | "todo"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "hold"
  | "qa"
  | "blocked";
```

### IssueType
```typescript
type IssueType = 
  | "story"
  | "task"
  | "bug"
  | "epic"
  | "subtask"
  | "feature"
  | "release"
  | "documentation"
  | "other";
```

## 🎨 Constants

### statuses
```typescript
const statuses: Record<IssueStatus, {
  label: string;
  color: string;
  bgColor: string;
  icon: React.ComponentType;
}>;
```

### priorities
```typescript
const priorities: Record<string, {
  label: string;
  color: string;
  bgColor: string;
}>;
```

### types
```typescript
const types: Record<IssueType | string, {
  label: string;
  color: string;
  icon: React.ComponentType;
}>;
```

### priorityMap
```typescript
const priorityMap: Record<string, "low" | "moderate" | "high" | "critical">;
```

## 🔄 Data Flow

```
Issue.tsx (Orchestrator)
    ↓
useIssues (Fetch data)
    ↓
useIssueFilters (Filter data)
    ↓
useIssueDragDrop (Handle drag-drop)
    ↓
Components (Render UI)
```

## 📝 Common Tasks

### Add a New Filter
1. Edit `useIssueFilters.ts`
2. Add filter logic in `filteredIssues` useMemo
3. Add filter button in `IssueHeader.tsx`

### Add a New Column Status
1. Add status to `IssueStatus` type
2. Add status config to `issueConfig.ts`
3. Component will automatically render

### Add a New Issue Type
1. Add type to `IssueType` type
2. Add type config to `issueConfig.ts`
3. Add option to `IssueModal.tsx` select

### Customize Colors
1. Edit `issueConfig.ts`
2. Update color values
3. Changes apply everywhere

### Add New Modal Fields
1. Add field to form state in `IssueModal.tsx`
2. Add input element
3. Add to API request

## 🧪 Testing

### Test a Hook
```typescript
import { renderHook, act } from '@testing-library/react';
import { useIssues } from '@/pages/manager/issue';

test('loads issues', async () => {
  const { result } = renderHook(() => useIssues());
  await act(async () => {
    await result.current.loadData();
  });
  expect(result.current.issues.length).toBeGreaterThan(0);
});
```

### Test a Component
```typescript
import { render, screen } from '@testing-library/react';
import { IssueCard } from '@/pages/manager/issue';

test('renders issue', () => {
  const issue = { /* mock */ };
  render(<IssueCard issue={issue} onEdit={() => {}} onDelete={() => {}} />);
  expect(screen.getByText(issue.title)).toBeInTheDocument();
});
```

## 🐛 Debugging

### Check Console
- Look for API errors
- Check network requests
- Verify data transformation

### Check State
- Use React DevTools
- Inspect hook state
- Check component props

### Check Network
- Open DevTools Network tab
- Check API requests
- Verify response format

## 📚 More Info

- Full docs: `README.md`
- Refactor summary: `ISSUE_MODULE_REFACTOR_COMPLETE.md`
- Original file: `Issue.tsx` (main orchestrator)

## 💡 Tips

1. **Reuse Components** - Use IssueCard, IssueColumn elsewhere
2. **Reuse Hooks** - Use useIssues, useIssueFilters in other pages
3. **Extend Easily** - Add new components without touching existing code
4. **Test Independently** - Each file can be tested in isolation
5. **Performance** - Memoized computations prevent unnecessary re-renders

## 🚨 Common Issues

### Issues not loading
- Check API endpoints
- Verify authentication
- Check browser console

### Drag-drop not working
- Verify @dnd-kit packages installed
- Check sensors configuration
- Check browser console

### Modals not showing
- Check z-index values
- Verify state is set
- Check CSS conflicts

## 📞 Support

For detailed information, see:
- `README.md` - Full documentation
- `QUICK_REFERENCE.md` - This file
- Component files - Inline comments
- Hook files - Inline comments
