# Attachments Feature - Quick Reference

## Quick Start

### Using the Hook

```typescript
import { useAttachments } from './hooks/useAttachments';

const { 
  attachments, 
  uploadAttachment, 
  deleteAttachment, 
  downloadAttachment 
} = useAttachments({ issueId: 123 });
```

### Upload File

```typescript
const file = new File(['content'], 'document.pdf');
await uploadAttachment(file);
```

### Download File

```typescript
await downloadAttachment(attachmentId, 'document.pdf');
```

### Delete File

```typescript
await deleteAttachment(attachmentId);
```

## Components

### FileUploadZone

```tsx
<FileUploadZone
  onFileSelect={handleFileSelect}
  isUploading={isUploading}
  maxSize={10 * 1024 * 1024}
/>
```

### AttachmentsList

```tsx
<AttachmentsList
  attachments={attachments}
  onDelete={handleDelete}
  onDownload={handleDownload}
  isLoading={isLoading}
/>
```

## API Methods

### Get Attachments
```typescript
const attachments = await attachmentApi.getByIssue(issueId);
```

### Upload
```typescript
const response = await attachmentApi.upload(issueId, file);
```

### Delete
```typescript
await attachmentApi.delete(attachmentId);
```

### Download
```typescript
await attachmentApi.download(attachmentId, fileName);
```

## File Limits

- **Max Size:** 10MB
- **Validation:** Client & Server

## Error Handling

```typescript
try {
  await uploadAttachment(file);
} catch (error) {
  console.error('Upload failed:', error.message);
}
```

## States

- `isLoading` - Loading attachments
- `isUploading` - Uploading file
- `error` - Error message

## Events

- `onFileSelect` - File selected
- `onDelete` - File deleted
- `onDownload` - File downloaded

## File Types

- Images: PNG, JPG, GIF, WebP, SVG
- Documents: PDF, DOC, DOCX, XLS, XLSX
- Archives: ZIP, RAR, 7Z
- Code: TXT, JSON, XML, JS, TS, PY
- Any file up to 10MB

## Integration

Already integrated in `IssueModal.tsx`:
- Attachments button
- Upload zone
- Attachments list
- Only in edit mode

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Upload fails | Check file size, internet, backend |
| Download fails | Check file exists, internet, browser |
| Not loading | Refresh, check issue ID, clear cache |

## Files

| File | Purpose |
|------|---------|
| `attachmentApi.ts` | API integration |
| `useAttachments.ts` | State management |
| `FileUploadZone.tsx` | Upload UI |
| `AttachmentsList.tsx` | Display UI |
| `IssueModal.tsx` | Integration |

## Documentation

- `ATTACHMENTS_GUIDE.md` - Full guide
- `ATTACHMENTS_QUICK_REFERENCE.md` - This file
- Code comments - Inline docs

## Status

✅ Ready for production

## Support

See `ATTACHMENTS_GUIDE.md` for detailed documentation.
