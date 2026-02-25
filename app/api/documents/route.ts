import { auth } from "@/app/(auth)/auth";
import {
  createEmptyDocument,
  deleteDocumentById,
  getDocumentsById,
  getDocumentsByUserId,
  renameDocumentById,
} from "@/lib/db/queries";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const response = await getDocumentsByUserId({ userId: session.user.id });
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST() {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const [doc] = await createEmptyDocument({
      title: "Nuevo Documento",
      kind: "text",
      userId: session.user.id,
    });

    return NextResponse.json(doc);
  } catch (error) {
    console.error("Error creating empty document:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { id, title } = await request.json();

    if (!id || !title?.trim()) {
      return new NextResponse("Missing id or title", { status: 400 });
    }

    const updated = await renameDocumentById({
      id,
      title: title.trim(),
      userId: session.user.id,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error renaming document:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("Missing id", { status: 400 });
    }

    // Verify ownership
    const docs = await getDocumentsById({ id });
    if (!docs.length || docs[0].userId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const deleted = await deleteDocumentById({ id, userId: session.user.id });
    return NextResponse.json(deleted);
  } catch (error) {
    console.error("Error deleting document:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
