import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import {
  getCaseById,
  getChatsByCaseId,
  getCaseFilesByCaseId,
  updateCase,
  deleteCaseById,
} from "@/lib/db/queries";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = params;

  try {
    const [caseData, chats, files] = await Promise.all([
      getCaseById({ id, userId: session.user.id! }),
      getChatsByCaseId({ caseId: id, userId: session.user.id! }),
      getCaseFilesByCaseId({ caseId: id }),
    ]);

    if (!caseData) {
      return new NextResponse("Case not found", { status: 404 });
    }

    return NextResponse.json({
      case: caseData,
      chats,
      files,
    });
  } catch (error) {
    console.error("Error fetching case details:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = params;

  try {
    const { title, description } = await request.json();

    if (!title?.trim()) {
      return new NextResponse("Title is required", { status: 400 });
    }

    const [updatedCase] = await updateCase({
      id,
      userId: session.user.id!,
      title: title.trim(),
      description: description?.trim(),
    });

    if (!updatedCase) {
      return new NextResponse("Case not found", { status: 404 });
    }

    return NextResponse.json({
      success: true,
      case: updatedCase,
    });
  } catch (error) {
    console.error("Error updating case:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = params;

  try {
    const [deletedCase] = await deleteCaseById({
      id,
      userId: session.user.id!,
    });

    if (!deletedCase) {
      return new NextResponse("Case not found", { status: 404 });
    }

    return NextResponse.json({
      success: true,
      deletedCase,
    });
  } catch (error) {
    console.error("Error deleting case:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
