import { auth } from "@/app/(auth)/auth";
import {
  createUserDocument,
  deleteDocumentById,
  getCaseById,
  getDocumentsByCaseId,
} from "@/lib/db/queries";
import { FileUploadError, processFileUpload } from "@/lib/upload";
import { del } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id: caseId } = await params;

  try {
    // Verify user owns the case
    const caseData = await getCaseById({
      id: caseId,
      userId: session.user.id,
    });

    if (!caseData) {
      return new NextResponse("Case not found", { status: 404 });
    }

    const files = await getDocumentsByCaseId({ caseId });

    return NextResponse.json({ files });
  } catch (error) {
    console.error("Error fetching case files:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id: caseId } = await params;

  try {
    // Verify user owns the case
    const caseData = await getCaseById({
      id: caseId,
      userId: session.user.id,
    });

    if (!caseData) {
      return new NextResponse("Case not found", { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }

    const result = await processFileUpload({
      file,
      userId: session.user.id,
      caseId,
    });

    // Save to database — linked to the specific case
    const [savedFile] = await createUserDocument({
      userId: session.user.id,
      caseId,
      filename: result.filename,
      originalName: result.originalName,
      mimeType: result.mimeType,
      size: result.size,
      content: result.fileUrl,
    });

    return NextResponse.json({
      success: true,
      file: savedFile,
    });
  } catch (error) {
    if (error instanceof FileUploadError) {
      return new NextResponse(error.message, { status: error.status });
    }
    console.error("Error uploading file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id: caseId } = await params;
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get("fileId");

  if (!fileId) {
    return new NextResponse("File ID required", { status: 400 });
  }

  try {
    // Verify user owns the case
    const caseData = await getCaseById({
      id: caseId,
      userId: session.user.id,
    });

    if (!caseData) {
      return new NextResponse("Case not found", { status: 404 });
    }

    const deletedFile = await deleteDocumentById({
      id: fileId,
      userId: session.user.id,
    });

    if (!deletedFile.length) {
      return new NextResponse("File not found", { status: 404 });
    }

    // Delete the blob from Vercel Blob storage
    const blobUrl = deletedFile[0].content;
    if (blobUrl) {
      try {
        await del(blobUrl);
      } catch (blobError) {
        // Log but don't fail the request if blob deletion fails
        console.error("Failed to delete blob:", blobError);
      }
    }

    return NextResponse.json({
      success: true,
      deletedFile: deletedFile[0],
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
