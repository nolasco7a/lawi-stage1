import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { auth } from "@/app/(auth)/auth";
import { type NextRequest, NextResponse } from "next/server";

const MIME_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  txt: "text/plain",
  md: "text/markdown",
  csv: "text/csv",
};

/**
 * Serves uploaded files from the filesystem.
 * Files may live in `uploads/users/{userId}/` or `uploads/cases/{caseId}/`.
 * We search the user's directory first, then fall back to scanning case dirs.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  const session = await auth();

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { filename } = await params;

  if (!filename || filename.includes("..") || filename.includes("/")) {
    return new NextResponse("Invalid filename", { status: 400 });
  }

  // Try user uploads directory first
  const userPath = join(process.cwd(), "uploads", "users", session.user.id, filename);

  let filePath: string | null = null;

  try {
    await stat(userPath);
    filePath = userPath;
  } catch {
    // File not in user dir, try case directories
    const { readdir } = await import("node:fs/promises");
    try {
      const casesDir = join(process.cwd(), "uploads", "cases");
      const caseDirs = await readdir(casesDir);

      for (const caseDir of caseDirs) {
        const candidatePath = join(casesDir, caseDir, filename);
        try {
          await stat(candidatePath);
          filePath = candidatePath;
          break;
        } catch {
          // Not in this case dir, continue
        }
      }
    } catch {
      // Cases directory doesn't exist
    }
  }

  if (!filePath) {
    return new NextResponse("File not found", { status: 404 });
  }

  try {
    const fileBuffer = await readFile(filePath);
    const ext = filename.split(".").pop()?.toLowerCase() || "";
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error reading file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
