import { join } from "node:path";
import { auth } from "@/app/(auth)/auth";
import { createUserDocument } from "@/lib/db/queries";
import { FileUploadError, processFileUpload } from "@/lib/upload";
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

    const uploadsDir = join(process.cwd(), "uploads", "users", session.user.id);

    const result = await processFileUpload({ file, uploadsDir });

    // Save to database — global document, not linked to a case
    const [savedFile] = await createUserDocument({
      userId: session.user.id,
      caseId: null,
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
