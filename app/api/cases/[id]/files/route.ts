import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import {
  createCaseFile,
  getCaseFilesByCaseId,
  getCaseById,
  deleteCaseFileById,
} from "@/lib/db/queries";
import { vectorizeDocument, validateFileType, validateFileSize } from "@/lib/vectorization";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { generateUUID } from "@/lib/utils";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id: caseId } = params;

  try {
    // Verify user owns the case
    const caseData = await getCaseById({
      id: caseId,
      userId: session.user.id!,
    });

    if (!caseData) {
      return new NextResponse("Case not found", { status: 404 });
    }

    const files = await getCaseFilesByCaseId({ caseId });

    return NextResponse.json({ files });
  } catch (error) {
    console.error("Error fetching case files:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id: caseId } = params;

  try {
    // Verify user owns the case
    const caseData = await getCaseById({
      id: caseId,
      userId: session.user.id!,
    });

    if (!caseData) {
      return new NextResponse("Case not found", { status: 404 });
    }

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
    const uploadsDir = join(process.cwd(), "uploads", "cases", caseId);
    await mkdir(uploadsDir, { recursive: true });

    // Save file to filesystem
    const filePath = join(uploadsDir, uniqueFilename);
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    // Vectorize document
    let vectorData = null;
    try {
      const vectorizedDoc = await vectorizeDocument(file);
      vectorData = {
        text: vectorizedDoc.text,
        vectors: vectorizedDoc.vectors,
        chunks: vectorizedDoc.chunks,
      };
    } catch (vectorError) {
      console.warn("Failed to vectorize document:", vectorError);
      // Continue without vectorization for now
    }

    // Save to database
    const [savedFile] = await createCaseFile({
      caseId,
      filename: uniqueFilename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      vectorData,
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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id: caseId } = params;
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get("fileId");

  if (!fileId) {
    return new NextResponse("File ID required", { status: 400 });
  }

  try {
    // Verify user owns the case
    const caseData = await getCaseById({
      id: caseId,
      userId: session.user.id!,
    });

    if (!caseData) {
      return new NextResponse("Case not found", { status: 404 });
    }

    const deletedFile = await deleteCaseFileById({
      id: fileId,
      caseId,
    });

    if (!deletedFile.length) {
      return new NextResponse("File not found", { status: 404 });
    }

    // TODO: Delete physical file from filesystem
    // const filePath = join(process.cwd(), 'uploads', 'cases', caseId, deletedFile[0].filename);
    // await unlink(filePath).catch(() => {}); // Ignore errors if file doesn't exist

    return NextResponse.json({
      success: true,
      deletedFile: deletedFile[0],
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
