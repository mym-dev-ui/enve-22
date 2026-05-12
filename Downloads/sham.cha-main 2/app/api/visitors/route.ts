import { NextResponse } from 'next/server';
import { createVisitor, listVisitors } from './store';
import { Visitor } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const visitors = await listVisitors();
  return NextResponse.json({ visitors });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<Visitor>;
    const visitor = await createVisitor(body ?? {});
    return NextResponse.json({ visitor }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
