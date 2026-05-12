import { NextResponse } from 'next/server';
import { deleteVisitor, updateVisitor } from '../store';
import { Visitor } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const patch = (await request.json()) as Partial<Visitor>;
    const updated = await updateVisitor(params.id, patch ?? {});
    if (!updated) {
      return NextResponse.json({ error: 'Visitor not found' }, { status: 404 });
    }
    return NextResponse.json({ visitor: updated });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const deleted = await deleteVisitor(params.id);
  if (!deleted) {
    return NextResponse.json({ error: 'Visitor not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
