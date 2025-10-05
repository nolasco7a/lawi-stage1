import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { db } from '@/lib/db';
import { document } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || session.user.id;

  // Only allow users to fetch their own documents
  if (userId !== session.user.id) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    const documents = await db
      .select()
      .from(document)
      .where(eq(document.userId, userId))
      .orderBy(desc(document.createdAt));

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}