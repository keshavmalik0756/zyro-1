# File Attachments - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         IssueModal                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Issue Form Fields                                       │  │
│  │  - Title, Description, Type, Status, Priority, etc.     │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Attachments Section (Edit Mode Only)                   │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │ [Paperclip] Attachments (3)                        │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │ FileUploadZone                                     │ │  │
│  │  │ ┌──────────────────────────────────────────────┐  │ │  │
│  │  │ │ [Upload Icon]                               │  │ │  │
│  │  │ │ Drag and drop your file here                │  │ │  │
│  │  │ │ or click to browse (Max 10MB)               │  │ │  │
│  │  │ └──────────────────────────────────────────────┘  │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │ AttachmentsList                                    │ │  │
│  │  │ ┌──────────────────────────────────────────────┐  │ │  │
│  │  │ │ [PDF] document.pdf                           │  │ │  │
│  │  │ │ 1.2 MB • Dec 28, 2025 10:30 AM              │  │ │  │
│  │  │ │                          [Download] [Delete] │  │ │  │
│  │  │ └──────────────────────────────────────────────┘  │ │  │
│  │  │ ┌──────────────────────────────────────────────┐  │ │  │
│  │  │ │ [Image] screenshot.png                       │  │ │  │
│  │  │ │ 2.5 MB • Dec 28, 2025 09:15 AM              │  │ │  │
│  │  │ │                          [Download] [Delete] │  │ │  │
│  │  │ └──────────────────────────────────────────────┘  │ │  │
│  │  │ ┌──────────────────────────────────────────────┐  │ │  │
│  │  │ │ [File] data.xlsx                             │  │ │  │
│  │  │ │ 0.8 MB • Dec 28, 2025 08:45 AM              │  │ │  │
│  │  │ │                          [Download] [Delete] │  │ │  │
│  │  │ └──────────────────────────────────────────────┘  │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ [Cancel] [Update]                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Action
    ↓
┌─────────────────────────────────────────┐
│ FileUploadZone / AttachmentsList        │
│ (UI Components)                         │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ useAttachments Hook                     │
│ - uploadAttachment()                    │
│ - deleteAttachment()                    │
│ - downloadAttachment()                  │
│ - loadAttachments()                     │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ attachmentApi Service                   │
│ - upload()                              │
│ - delete()                              │
│ - download()                            │
│ - getByIssue()                          │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ Backend API                             │
│ POST   /attachment/upload               │
│ DELETE /attachment/{id}                 │
│ GET    /attachment/{id}/download        │
│ GET    /attachment/issue/{issueId}      │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ Database & File Storage                 │
│ - Attachment Records                    │
│ - File Storage                          │
└─────────────────────────────────────────┘
```

## Component Hierarchy

```
IssueModal
├── Form Fields
│   ├── Title Input
│   ├── Description Textarea
│   ├── Type Select
│   ├── Status Select
│   ├── Priority Select
│   └── Story Points Input
│
├── Attachments Section (Edit Mode)
│   ├── Toggle Button
│   │   └── [Paperclip] Attachments (count)
│   │
│   └── Collapsible Content
│       ├── FileUploadZone
│       │   ├── Drag-Drop Area
│       │   ├── File Input
│       │   └── Upload Progress
│       │
│       └── AttachmentsList
│           ├── Attachment Item 1
│           │   ├── File Icon
│           │   ├── File Info
│           │   ├── Download Button
│           │   └── Delete Button
│           │
│           ├── Attachment Item 2
│           │   └── ...
│           │
│           └── Empty State
│
└── Action Buttons
    ├── Cancel
    └── Update/Create
```

## State Management

```
useAttachments Hook
│
├── State
│   ├── attachments: Attachment[]
│   ├── isLoading: boolean
│   ├── isUploading: boolean
│   └── error: string | null
│
├── Methods
│   ├── uploadAttachment(file: File)
│   ├── deleteAttachment(id: number)
│   ├── downloadAttachment(id: number, name: string)
│   └── loadAttachments()
│
└── Effects
    └── useEffect(() => loadAttachments(), [issueId])
```

## Upload Flow

```
User selects file
    ↓
FileUploadZone validates
    ├─ Check file size (< 10MB)
    └─ Check file type (optional)
    ↓
uploadAttachment() called
    ↓
API request sent
    ├─ POST /attachment/upload
    ├─ FormData with file
    └─ Authorization header
    ↓
Backend processes
    ├─ Validate file
    ├─ Store file
    └─ Create record
    ↓
Response received
    ├─ Add to local state
    ├─ Show success toast
    └─ Update UI
```

## Download Flow

```
User clicks download
    ↓
downloadAttachment() called
    ├─ attachmentId
    └─ fileName
    ↓
API request sent
    ├─ GET /attachment/{id}/download
    ├─ responseType: 'blob'
    └─ Authorization header
    ↓
Backend processes
    ├─ Verify permissions
    ├─ Stream file
    └─ Return blob
    ↓
Browser handles
    ├─ Create blob URL
    ├─ Create download link
    ├─ Trigger download
    └─ Clean up
    ↓
Success toast shown
```

## Delete Flow

```
User clicks delete
    ↓
deleteAttachment() called
    ├─ attachmentId
    └─ Optimistic update
    ↓
API request sent
    ├─ DELETE /attachment/{id}
    └─ Authorization header
    ↓
Backend processes
    ├─ Verify permissions
    ├─ Delete record
    └─ Delete file
    ↓
Response received
    ├─ Remove from state
    ├─ Show success toast
    └─ Update UI
```

## Error Handling Flow

```
Operation fails
    ↓
Error caught
    ├─ Network error
    ├─ Server error
    ├─ Validation error
    └─ Permission error
    ↓
Error message extracted
    ├─ From response
    ├─ From exception
    └─ Default message
    ↓
User notified
    ├─ Toast notification
    ├─ Error message
    └─ Retry option
    ↓
State updated
    ├─ Error state set
    ├─ Loading cleared
    └─ UI updated
```

## File Type Detection

```
File uploaded
    ↓
Get MIME type
    ├─ image/* → Image icon
    ├─ application/pdf → PDF icon
    └─ other → File icon
    ↓
Display icon
    ├─ Blue for images
    ├─ Red for PDF
    └─ Gray for others
```

## Performance Optimization

```
IssueModal
    ↓
useAttachments Hook
    ├─ Memoized methods
    ├─ Proper dependencies
    └─ Optimistic updates
    ↓
Components
    ├─ FileUploadZone (memoized)
    ├─ AttachmentsList (memoized)
    └─ Attachment Item (memoized)
    ↓
API Calls
    ├─ Only when needed
    ├─ Batched requests
    └─ Cached responses
```

## Security Flow

```
File Upload
    ↓
Client-side validation
    ├─ File size check
    ├─ File type check (optional)
    └─ Input sanitization
    ↓
Server-side validation
    ├─ Authentication check
    ├─ Authorization check
    ├─ File type validation
    ├─ Virus scanning (optional)
    └─ Storage encryption (optional)
    ↓
File Storage
    ├─ Secure location
    ├─ Access control
    └─ Backup
```

## Integration Points

```
IssueModal
    ├─ Imports useAttachments
    ├─ Imports FileUploadZone
    ├─ Imports AttachmentsList
    └─ Renders attachments section
        ├─ Only in edit mode
        ├─ Collapsible
        └─ Full functionality
```

## API Endpoints

```
POST /attachment/upload
├─ Request: FormData { file, issue_id }
├─ Response: { id, file_name, file_size, ... }
└─ Auth: Required

GET /attachment/issue/{issueId}
├─ Request: None
├─ Response: Attachment[]
└─ Auth: Required

DELETE /attachment/{attachmentId}
├─ Request: None
├─ Response: { success: true }
└─ Auth: Required

GET /attachment/{attachmentId}/download
├─ Request: None
├─ Response: File blob
└─ Auth: Required
```

## Database Schema

```
attachments
├─ id (PK)
├─ issue_id (FK)
├─ file_name
├─ file_size
├─ file_type
├─ file_url
├─ uploaded_by (FK)
├─ created_at
└─ updated_at
```

## Bundle Size Impact

```
Total: ~9KB (gzipped)
├─ attachmentApi.ts: ~2KB
├─ useAttachments.ts: ~3KB
├─ FileUploadZone.tsx: ~2KB
└─ AttachmentsList.tsx: ~2KB
```

## Browser Compatibility

```
✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
✅ Mobile browsers
```

---

**Last Updated:** December 28, 2025
