import { auth } from "@/app/(auth)/auth";
import { getDocumentsByUserId } from "@/lib/db/queries";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const response = await getDocumentsByUserId({ userId: session.user.id });
    console.info("response", response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
