import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { 
  createCase, 
  getCasesWithChatCount, 
  getTotalCasesByUserId 
} from '@/lib/db/queries';
import { CHAT_PAGE_SIZE } from '@/lib/constants';

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get('page') || '1', 10);
  const offset = (page - 1) * CHAT_PAGE_SIZE;

  try {
    const [result, totalCount] = await Promise.all([
      getCasesWithChatCount({
        userId: session.user.id!,
        limit: CHAT_PAGE_SIZE,
        offset,
      }),
      getTotalCasesByUserId({ userId: session.user.id! })
    ]);

    return NextResponse.json({
      cases: result.cases,
      hasMore: result.hasMore,
      currentPage: page,
      totalCases: totalCount,
    });
  } catch (error) {
    console.error('Error fetching cases:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { title, description } = await request.json();

    if (!title || title.trim().length === 0) {
      return new NextResponse('Title is required', { status: 400 });
    }

    const result = await createCase({
      title: title.trim(),
      description: description?.trim() || undefined,
      userId: session.user.id!,
    });

    return NextResponse.json({ success: true, case: result[0] });
  } catch (error) {
    console.error('Error creating case:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}