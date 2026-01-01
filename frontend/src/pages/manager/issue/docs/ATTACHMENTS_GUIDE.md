# File Attachments Feature Guide

## Overview

The file attachments feature allows users to upload, download, and manage files associated with issues. This guide covers the implementation, usage, and best practices.

## Architecture

### Components

#### 1. **FileUploadZone** (`components/FileUploadZone.tsx`)
Drag-and-drop file upload component with visual feedback.

**Features:**
- Drag-and-drop support
- Click to browse
- File size validation (10MB max)
- Visual feedback during upload
- File preview before upload

**Props:**
```typescript
interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
  accept?: string;
  maxSize?: number; // in bytes
}
```

**Usage:**
```tsx
<FileUploadZone
  onFileSelect={handleFileSelect}
  isUploading={isUploading}
  maxSize={10 * 1024 * 1024}
/>
```

#### 2. **AttachmentsList** (`components/AttachmentsList.tsx`)
Displays list of uploaded attachments with download/delete actions.

**Features:**
- File type icons (image, PDF, generic)
- File size formatting
- Upload date/time
- Download button
- Delete button with confirmation
- Hover actions

**Props:**
```typescript
interface AttachmentsListProps {
  attachments: Attachment[];
  onDelete: (attachmentId: number) => void;
  onDownload: (attachmentId: number, fileName: string) => void;
  isLoading?: boolean;
}
```

**Usage:**
```tsx
<AttachmentsList
  attachments={attachments}
  onDelete={handleDelete}
  onDownload={handleDownload}
  isLoading={isLoading}
/>
```

### Hooks

#### **useAttachments** (`hooks/useAttachments.ts`)
Custom hook for managing attachment lifecycle.

**Features:**
- Load attachments for an issue
- Upload new attachments
- Delete attachments
- Download attachments
- Error handling
- Loading states

**Usage:**
```typescript
const {
  attachments,
  isLoading,
  isUploading,
  error,
  uploadAttachment,
  deleteAttachment,
  downloadAttachment,
  loadAttachments,
} = useAttachments({ issueId: 123 });
```

**Methods:**

- `uploadAttachment(file: File)` - Upload a file
- `deleteAttachment(attachmentId: number)` - Delete an attachment
- `downloadAttachment(attachmentId: number, fileName: string)` - Download a file
- `loadAttachments()` - Refresh attachments list

### API Service

#### **attachmentApi** (`services/api/attachmentApi.ts`)
Backend API integration for attachment operations.

**Endpoints:**

```typescript
// Get all attachments for an issue
GET /attachment/issue/{issueId}

// Get single attachment
GET /attachment/{attachmentId}

// Upload attachment
POST /attachment/upload
Content-Type: multipart/form-data
Body: { file, issue_id }

// Delete attachment
DELETE /attachment/{attachmentId}

// Download attachment
GET /attachment/{attachmentId}/download
```

**Methods:**

```typescript
// Get attachments
const attachments = await attachmentApi.getByIssue(issueId);

// Upload file
const response = await attachmentApi.upload(issueId, file);

// Delete attachment
await attachmentApi.delete(attachmentId);

// Download file
await attachmentApi.download(attachmentId, fileName);
```

## Integration with IssueModal

The attachment feature is integrated into the IssueModal component for editing issues.

### Features in Modal

1. **Attachments Toggle Button**
   - Shows attachment count
   - Collapsible section
   - Only visible in edit mode

2. **Upload Zone**
   - Drag-and-drop support
   - File validation
   - Upload progress

3. **Attachments List**
   - View uploaded files
   - Download files
   - Delete files

### Code Example

```tsx
// In IssueModal.tsx
const {
  attachments,
  isUploading,
  uploadAttachment,
  deleteAttachment,
  downloadAttachment,
} = useAttachments({ issueId: issue?.apiId });

// In JSX
{issue && (
  <div className="border-t border-[#DFE1E6] pt-4">
    <button
      type="button"
      onClick={() => setShowAttachments(!showAttachments)}
      className="flex items-center gap-2 text-sm font-medium text-[#0052CC]"
    >
      <Paperclip className="w-4 h-4" />
      Attachments ({attachments.length})
    </button>

    {showAttachments && (
      <motion.div className="space-y-4">
        <FileUploadZone
          onFileSelect={uploadAttachment}
          isUploading={isUploading}
        />
        <AttachmentsList
          attachments={attachments}
          onDelete={deleteAttachment}
          onDownload={downloadAttachment}
        />
      </motion.div>
    )}
  </div>
)}
```

## File Size Limits

- **Maximum file size:** 10MB
- **Validation:** Client-side and server-side
- **Error handling:** User-friendly error messages

## Supported File Types

- **Images:** PNG, JPG, GIF, WebP, SVG
- **Documents:** PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
- **Archives:** ZIP, RAR, 7Z
- **Code:** TXT, JSON, XML, JS, TS, PY, etc.
- **Other:** Any file type (up to 10MB)

## Error Handling

### Upload Errors

```typescript
try {
  await uploadAttachment(file);
} catch (error) {
  // File size exceeded
  // Network error
  // Server error
  // Permission denied
}
```

### Download Errors

```typescript
try {
  await downloadAttachment(attachmentId, fileName);
} catch (error) {
  // File not found
  // Network error
  // Permission denied
}
```

### Delete Errors

```typescript
try {
  await deleteAttachment(attachmentId);
} catch (error) {
  // File not found
  // Permission denied
  // Server error
}
```

## User Experience

### Upload Flow

1. User clicks "Attachments" button
2. Upload zone appears
3. User drags file or clicks to browse
4. File is validated
5. Upload starts with progress indicator
6. File appears in attachments list
7. Success toast notification

### Download Flow

1. User hovers over attachment
2. Download button appears
3. User clicks download
4. File downloads to device
5. Success toast notification

### Delete Flow

1. User hovers over attachment
2. Delete button appears
3. User clicks delete
4. File is removed from list
5. Success toast notification

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**
   - Attachments only load when issue is opened
   - Attachments section is collapsible

2. **Memoization**
   - Components memoized to prevent unnecessary re-renders
   - Hooks use proper dependency arrays

3. **Efficient State Management**
   - Local state for UI feedback
   - Optimistic updates for better UX

4. **File Size Limits**
   - 10MB max prevents large uploads
   - Reduces server storage requirements

### Bundle Size Impact

- `attachmentApi.ts` - ~2KB
- `useAttachments.ts` - ~3KB
- `FileUploadZone.tsx` - ~2KB
- `AttachmentsList.tsx` - ~2KB
- **Total:** ~9KB (gzipped)

## Security Considerations

### Client-Side

- File size validation
- File type checking (optional)
- Input sanitization

### Server-Side (Backend)

- Authentication required
- Authorization checks
- File type validation
- Virus scanning (recommended)
- Storage encryption (recommended)

## Testing

### Unit Tests

```typescript
// Test file upload
test('uploads file successfully', async () => {
  const { uploadAttachment } = useAttachments({ issueId: 1 });
  const file = new File(['content'], 'test.txt');
  const result = await uploadAttachment(file);
  expect(result).toBeDefined();
});

// Test file deletion
test('deletes attachment', async () => {
  const { deleteAttachment } = useAttachments({ issueId: 1 });
  await deleteAttachment(1);
  // Verify deletion
});
```

### Integration Tests

```typescript
// Test complete upload flow
test('complete upload flow', async () => {
  // 1. Open issue modal
  // 2. Click attachments
  // 3. Upload file
  // 4. Verify file appears
  // 5. Download file
  // 6. Delete file
  // 7. Verify deletion
});
```

## Future Enhancements

### Phase 1 (Ready Now)
- ✅ Basic upload/download/delete
- ✅ File type icons
- ✅ File size formatting
- ✅ Error handling

### Phase 2 (1-2 weeks)
- [ ] Image preview
- [ ] File drag-drop reordering
- [ ] Bulk upload
- [ ] Attachment comments

### Phase 3 (1-2 months)
- [ ] Virus scanning
- [ ] File versioning
- [ ] Attachment sharing
- [ ] Storage optimization

### Phase 4 (3+ months)
- [ ] Real-time sync
- [ ] Offline support
- [ ] Advanced search
- [ ] Analytics

## Troubleshooting

### Upload Fails

**Problem:** File upload fails with error
**Solution:**
1. Check file size (max 10MB)
2. Check internet connection
3. Check browser console for errors
4. Verify backend is running
5. Check authentication token

### Download Fails

**Problem:** Download doesn't start
**Solution:**
1. Check file exists
2. Check internet connection
3. Check browser download settings
4. Check browser console for errors
5. Try different browser

### Attachments Not Loading

**Problem:** Attachments list is empty
**Solution:**
1. Refresh page
2. Check issue ID
3. Check backend API
4. Check browser console
5. Clear browser cache

## API Response Examples

### Upload Response

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "id": 1,
    "issue_id": 123,
    "file_name": "document.pdf",
    "file_size": 1024000,
    "file_type": "application/pdf",
    "file_url": "https://api.example.com/files/1",
    "uploaded_by": 1,
    "created_at": "2025-12-28T10:30:00Z"
  }
}
```

### Get Attachments Response

```json
{
  "success": true,
  "message": "Attachments retrieved successfully",
  "data": [
    {
      "id": 1,
      "issue_id": 123,
      "file_name": "document.pdf",
      "file_size": 1024000,
      "file_type": "application/pdf",
      "file_url": "https://api.example.com/files/1",
      "uploaded_by": 1,
      "uploaded_by_name": "John Doe",
      "created_at": "2025-12-28T10:30:00Z",
      "updated_at": "2025-12-28T10:30:00Z"
    }
  ]
}
```

## Best Practices

1. **Always validate file size** - Prevent large uploads
2. **Show upload progress** - Keep users informed
3. **Handle errors gracefully** - Show helpful messages
4. **Optimize file storage** - Compress images, archive old files
5. **Secure file access** - Verify permissions before download
6. **Clean up old files** - Remove unused attachments
7. **Monitor storage usage** - Track total storage
8. **Backup files** - Ensure data safety

## Support

For issues or questions:
1. Check this guide
2. Review code comments
3. Check browser console
4. Review backend logs
5. Contact development team
