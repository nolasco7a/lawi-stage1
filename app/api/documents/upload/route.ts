import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { auth } from "@/app/(auth)/auth";
import { createUserDocument } from "@/lib/db/queries";
import { generateUUID } from "@/lib/utils";
import {
  type VectorizedDocument,
  validateFileSize,
  validateFileType,
  vectorizeDocument,
} from "@/lib/vectorization";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }

    // Validate file
    if (!validateFileType(file)) {
      return new NextResponse("Invalid file type", { status: 400 });
    }

    if (!validateFileSize(file)) {
      return new NextResponse("File too large (max 10MB)", { status: 400 });
    }

    // Generate unique filename
    const fileExtension = file.name.split(".").pop() || "";
    const uniqueFilename = `${generateUUID()}.${fileExtension}`;

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "uploads", "users", session.user.id);
    await mkdir(uploadsDir, { recursive: true });

    // Save file to filesystem
    const filePath = join(uploadsDir, uniqueFilename);
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    let vectorData: VectorizedDocument | null = null;
    try {
      const vectorizedDoc = await vectorizeDocument(file);
      vectorData = {
        text: vectorizedDoc.text,
        vectors: vectorizedDoc.vectors,
        chunks: vectorizedDoc.chunks,
      };
    } catch (vectorError) {
      console.warn("Failed to vectorize document:", vectorError);
    }

    // Save to database
    const [savedFile] = await createUserDocument({
      userId: session.user.id,
      caseId: null, // Global document, not linked to a case
      filename: uniqueFilename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      content: `/api/files/${uniqueFilename}`,
      vectorData: vectorData ?? undefined,
    });

    return NextResponse.json({
      success: true,
      file: savedFile,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
