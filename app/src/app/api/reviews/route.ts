import { NextRequest, NextResponse } from "next/server";
import { getReviews, saveReviews, Review } from "@/lib/reviews";

export async function GET(req: NextRequest) {
  const reviews = getReviews();
  const productId = req.nextUrl.searchParams.get("productId");
  if (productId) return NextResponse.json(reviews.filter((r) => r.productId === productId));
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const reviews = getReviews();

  const review: Review = {
    id: Date.now().toString(),
    productId: body.productId,
    productName: body.productName,
    orderId: body.orderId,
    customerName: body.customerName,
    rating: Math.min(5, Math.max(1, Number(body.rating))),
    comment: body.comment || "",
    date: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
  };

  reviews.push(review);
  saveReviews(reviews);

  return NextResponse.json(review, { status: 201 });
}
