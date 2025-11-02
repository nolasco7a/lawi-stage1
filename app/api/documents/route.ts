import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db";
import { document } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(_: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const documents = await db
      .select()
      .from(document)
      .where(eq(document.userId, session.user.id))
      .orderBy(desc(document.createdAt));

    return NextResponse.json({
      documents,
      totalDocuments: documents.length,
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
