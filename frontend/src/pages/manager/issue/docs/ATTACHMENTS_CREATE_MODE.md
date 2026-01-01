# Attachments in Create Issue Mode

## Overview

The file attachments feature now supports uploading files during issue creation. Users can add attachments when creating a new issue, and they will be automatically uploaded after the issue is created.

## Features

### Create Mode (New Issue)
- ✅ Add files to upload queue
- ✅ View pending files before creation
- ✅ Remove files from queue
- ✅ Automatic upload after issue creation
- ✅ Progress notifications
- ✅ Error handling

### Edit Mode (Existing Issue)
- ✅ Upload files immediately
- ✅ Download files
- ✅ Delete files
- ✅ View uploaded files

---

## User Experience

### Create Issue with Attachments

#### Step 1: Open Create Issue Modal
```
User clicks "Create Issue" button
↓
IssueModal opens in create mode
```

#### Step 2: Fill Issue Details
```
User fills in:
- Title
- Description
- Type
- Priority
- Story Points
- Project
- Sprint (optional)
- Assignee (optional)
```

#### Step 3: Add Attachments (Optional)
```
User clicks "Attachments (0)" button
↓
Upload zone appears
↓
User drags files or clicks to browse
↓
Files are added to pending queue
↓
User can remove files if needed
```

#### Step 4: Create Issue
```
User clicks "Create" button
↓
Issue is created on backend
↓
Pending attachments are uploaded
↓
Success notification
↓
Modal closes
```

---

## Implementation Details

### State Management

```typescript
// Pending attachments for create mode
const [pendingAttachments, setPendingAttachments] = useState<File[]>([]);

// Existing attachments for edit mode
const {
  attachments,
  isUploading,
  uploadAttachment,
  deleteAttachment,
  downloadAttachment,
} = useAttachments({ issueId: issue?.apiId });
```

### Create Mode Flow

```typescript
// 1. Create issue
const createdIssue = await issueService.create(createData);
const createdIssueId = createdIssue.id;

// 2. Upload pending attachments
for (const file of pendingAttachments) {
  await attachmentApi.upload(createdIssueId, file);
}

// 3. Clear pending attachments
setPendingAttachments([]);
```

### Edit Mode Flow

```typescript
// 1. Update issue
await issueService.update(issue.apiId, updateData);

// 2. Upload new attachments immediately
await uploadAttachment(file);

// 3. Delete attachments
await deleteAttachment(attachmentId);
```

---

## UI Components

### Pending Attachments List (Create Mode)

```
Files to Upload (2)
┌─────────────────────────────────────────┐
│ [📎] document.pdf                       │
│ 1.2 MB                          [🗑️]   │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ [📎] screenshot.png                     │
│ 2.5 MB                          [🗑️]   │
└─────────────────────────────────────────┘

Files will be uploaded after the issue is created
```

### Uploaded Attachments List (Edit Mode)

```
Uploaded Files
┌─────────────────────────────────────────┐
│ [📄] document.pdf                       │
│ 1.2 MB • Dec 28, 2025 10:30 AM          │
│                          [⬇️] [🗑️]     │
└─────────────────────────────────────────┘
```

---

## Error Handling

### File Size Validation
```
User tries to upload file > 10MB
↓
Error: "File size must be less than 10MB"
↓
File is not added to queue
```

### Upload Failure During Creation
```
Issue created successfully
↓
Attachment upload fails
↓
Error: "Failed to upload {filename}"
↓
User can retry or continue
```

### Network Error
```
User loses connection during upload
↓
Error: "Failed to upload file"
↓
User can retry after reconnecting
```

---

## Notifications

### Success Messages
```
✓ {filename} added to upload queue
✓ Issue created successfully
✓ Uploading attachments...
✓ All attachments uploaded successfully
```

### Error Messages
```
✗ File size must be less than 10MB
✗ Failed to upload {filename}
✗ Failed to save issue
```

---

## Code Example

### Using Attachments in Create Mode

```typescript
// In IssueModal.tsx
const [pendingAttachments, setPendingAttachments] = useState<File[]>([]);

// Add file to queue
const handleAddAttachment = (file: File) => {
  setPendingAttachments((prev) => [...prev, file]);
  toast.success(`${file.name} added to upload queue`);
};

// Remove file from queue
const handleRemoveAttachment = (index: number) => {
  setPendingAttachments((prev) =>
    prev.filter((_, i) => i !== index)
  );
  toast.success("File removed from queue");
};

// Submit form with attachments
const handleSubmit = async (e: React.FormEvent) => {
  // Create issue
  const createdIssue = await issueService.create(createData);
  
  // Upload pending attachments
  if (pendingAttachments.length > 0) {
    for (const file of pendingAttachments) {
      await attachmentApi.upload(createdIssue.id, file);
    }
    setPendingAttachments([]);
  }
};
```

---

## Limitations

### Current Limitations
- Files are uploaded sequentially (one at a time)
- No progress bar for individual files
- No pause/resume functionality
- No bulk upload optimization

### Future Enhancements
- [ ] Parallel uploads (multiple files at once)
- [ ] Progress bar for each file
- [ ] Pause/resume functionality
- [ ] Drag-drop reordering
- [ ] Image preview
- [ ] Bulk upload optimization

---

## Performance Considerations

### Upload Strategy
- Sequential uploads to avoid server overload
- One file at a time after issue creation
- Optimized for typical use cases (1-5 files)

### Bundle Size Impact
- No additional bundle size (uses existing components)
- Minimal state overhead

### Network Impact
- Uploads happen after issue creation
- User can close modal while uploads continue
- Automatic retry on failure

---

## Security

### Client-Side
- File size validation (10MB max)
- File type checking (optional)
- Input sanitization

### Server-Side
- Authentication required
- Authorization checks
- File type validation
- Virus scanning (recommended)
- Storage encryption (recommended)

---

## Testing

### Manual Testing Checklist

#### Create Mode
- [ ] Add single file to queue
- [ ] Add multiple files to queue
- [ ] Remove file from queue
- [ ] Create issue with attachments
- [ ] Verify files are uploaded
- [ ] Test file size limit
- [ ] Test network error handling
- [ ] Test on mobile/tablet/desktop

#### Edit Mode
- [ ] Upload file to existing issue
- [ ] Download file
- [ ] Delete file
- [ ] Verify file appears in list
- [ ] Test file size limit
- [ ] Test error handling

### Automated Testing

```typescript
// Test adding file to queue
test('adds file to pending attachments', () => {
  const file = new File(['content'], 'test.txt');
  handleAddAttachment(file);
  expect(pendingAttachments).toContain(file);
});

// Test removing file from queue
test('removes file from pending attachments', () => {
  handleRemoveAttachment(0);
  expect(pendingAttachments.length).toBe(0);
});

// Test upload after creation
test('uploads attachments after issue creation', async () => {
  await handleSubmit(mockEvent);
  expect(attachmentApi.upload).toHaveBeenCalled();
});
```

---

## Troubleshooting

### Files Not Uploading
**Problem:** Files added to queue but not uploaded after creation
**Solution:**
1. Check browser console for errors
2. Verify backend API is running
3. Check network tab for failed requests
4. Verify authentication token is valid

### File Size Error
**Problem:** "File size must be less than 10MB"
**Solution:**
1. Check file size
2. Compress file if possible
3. Split into multiple files
4. Contact admin if limit needs adjustment

### Upload Fails After Creation
**Problem:** Issue created but attachments not uploaded
**Solution:**
1. Check network connection
2. Retry upload manually
3. Check backend logs
4. Verify file permissions

---

## API Integration

### Backend Requirements

The backend needs to support:

1. **Create Issue Endpoint**
   ```
   POST /issue
   Returns: { id, name, ... }
   ```

2. **Upload Attachment Endpoint**
   ```
   POST /attachment/upload
   Body: { file, issue_id }
   Returns: { id, file_name, ... }
   ```

### Example Flow

```
Frontend                          Backend
   |                                |
   |-- POST /issue ----------------->|
   |                                |
   |<-- { id: 123, ... } ------------|
   |                                |
   |-- POST /attachment/upload ----->|
   |    { file, issue_id: 123 }     |
   |                                |
   |<-- { id: 1, ... } -------------|
   |                                |
   |-- POST /attachment/upload ----->|
   |    { file, issue_id: 123 }     |
   |                                |
   |<-- { id: 2, ... } -------------|
```

---

## Best Practices

1. **Validate Files Early**
   - Check size before adding to queue
   - Show clear error messages

2. **Provide Feedback**
   - Show upload progress
   - Confirm successful uploads
   - Handle errors gracefully

3. **Optimize Performance**
   - Upload sequentially to avoid overload
   - Show upload status
   - Allow cancellation

4. **Improve UX**
   - Allow drag-drop
   - Show file previews
   - Allow file reordering
   - Provide clear instructions

---

## Summary

The attachments feature now supports both create and edit modes:

- **Create Mode:** Add files to queue, upload after creation
- **Edit Mode:** Upload files immediately, download, delete

This provides a seamless experience for users who want to attach files when creating issues.

---

**Last Updated:** December 28, 2025

**Status:** ✅ COMPLETE

**Version:** 1.0.0
