import { NextRequest, NextResponse } from "next/server";
import { getReviews, saveReviews } from "@/lib/reviews";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reviews = getReviews();
  const filtered = reviews.filter((r) => r.id !== id);
  saveReviews(filtered);
  return NextResponse.json({ ok: true });
}
