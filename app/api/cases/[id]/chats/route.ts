import { auth } from "@/app/(auth)/auth";
import { getCaseById, saveChatWithCase } from "@/lib/db/queries";
import { generateUUID } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";

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

    const { title } = await request.json();

    if (!title?.trim()) {
      return new NextResponse("Title is required", { status: 400 });
    }

    // Create new chat associated with case
    const chatId = generateUUID();
    await saveChatWithCase({
      id: chatId,
      userId: session.user.id,
      title: title.trim(),
      visibility: "private",
      caseId,
    });

    return NextResponse.json({
      success: true,
      chatId,
      redirectUrl: `/chat/${chatId}`,
    });
  } catch (error) {
    console.error("Error creating chat for case:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
