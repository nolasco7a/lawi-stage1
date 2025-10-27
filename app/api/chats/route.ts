import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { searchChatsByUserId, updateChatTitle, getTotalChatsByUserId } from "@/lib/db/queries";
import { CHAT_PAGE_SIZE } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || undefined;
  const page = Number.parseInt(searchParams.get("page") || "1", 10);
  const offset = (page - 1) * CHAT_PAGE_SIZE;

  try {
    const [result, totalCount] = await Promise.all([
      searchChatsByUserId({
        userId: session.user.id!,
        query,
        limit: CHAT_PAGE_SIZE,
        offset,
      }),
      getTotalChatsByUserId({ userId: session.user.id! }),
    ]);

    return NextResponse.json({
      chats: result.chats,
      hasMore: result.hasMore,
      currentPage: page,
      totalChats: totalCount,
    });
  } catch (error) {
    console.error("Error searching chats:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { chatId, title } = await request.json();

    if (!chatId || !title) {
      return new NextResponse("Chat ID and title are required", {
        status: 400,
      });
    }

    const result = await updateChatTitle({ chatId, title });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error updating chat title:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
