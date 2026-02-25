import { generateUUID } from "@/lib/utils";
import { validateFileSize, validateFileType } from "@/lib/vectorization";
import { put } from "@vercel/blob";

export interface FileUploadResult {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  fileUrl: string;
}

/**
 * Shared file upload processing.
 * Handles: validation, upload to Vercel Blob.
 * Does NOT insert a DB record — that's the caller's responsibility
 * (since files/ passes caseId: null and cases/ passes caseId: <uuid>).
 */
export async function processFileUpload({
  file,
  userId,
  caseId,
}: {
  file: File;
  userId: string;
  caseId?: string | null;
}): Promise<FileUploadResult> {
  // Validate file type
  if (!validateFileType(file)) {
    throw new FileUploadError("Invalid file type", 400);
  }

  // Validate file size (25MB)
  if (!validateFileSize(file)) {
    throw new FileUploadError("File too large (max 25MB)", 400);
  }

  // Generate unique filename
  const fileExtension = file.name.split(".").pop() || "";
  const uniqueFilename = `${generateUUID()}.${fileExtension}`;

  // Build path for organization in Blob storage
  const blobPath = caseId
    ? `cases/${caseId}/${uniqueFilename}`
    : `users/${userId}/${uniqueFilename}`;

  // Upload to Vercel Blob
  const bytes = await file.arrayBuffer();
  const blob = await put(blobPath, Buffer.from(bytes), {
    access: "public",
  });

  return {
    filename: uniqueFilename,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    fileUrl: blob.url,
  };
}

/**
 * Custom error class for file upload validation errors, with HTTP status code.
 */
export class FileUploadError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "FileUploadError";
    this.status = status;
  }
}
