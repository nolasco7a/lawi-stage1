import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { generateUUID } from "@/lib/utils";
import { validateFileSize, validateFileType } from "@/lib/vectorization";

export interface FileUploadResult {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  filePath: string;
  fileUrl: string;
}

/**
 * Shared file upload processing.
 * Handles: validation, filesystem save.
 * Does NOT insert a DB record — that's the caller's responsibility
 * (since files/ passes caseId: null and cases/ passes caseId: <uuid>).
 *
 * NOTE: Vectorization is disabled for now (placeholder had fatal bugs).
 * It will be re-implemented as a separate task with a real embeddings provider.
 */
export async function processFileUpload({
  file,
  uploadsDir,
}: {
  file: File;
  uploadsDir: string;
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

  // Create uploads directory if it doesn't exist
  await mkdir(uploadsDir, { recursive: true });

  // Save file to filesystem
  const filePath = join(uploadsDir, uniqueFilename);
  const bytes = await file.arrayBuffer();
  await writeFile(filePath, Buffer.from(bytes));

  return {
    filename: uniqueFilename,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    filePath,
    fileUrl: `/api/files/${uniqueFilename}`,
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
