import { NextRequest, NextResponse } from "next/server";
import { getReviews, saveReviews, Review } from "@/lib/reviews";
import { getProducts } from "@/lib/products";

export async function GET(req: NextRequest) {
  const reviews = getReviews();
  const productId = req.nextUrl.searchParams.get("productId");
  const category = req.nextUrl.searchParams.get("category");
  let result = reviews;
  if (productId) result = result.filter((r) => r.productId === productId);
  if (category && category !== "Semua") result = result.filter((r) => r.category === category);
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const reviews = getReviews();

  const product = getProducts().find((p) => p.id === body.productId);

  const review: Review = {
    id: Date.now().toString(),
    productId: body.productId,
    productName: body.productName,
    orderId: body.orderId,
    customerName: body.customerName,
    rating: Math.min(5, Math.max(1, Number(body.rating))),
    comment: body.comment || "",
    date: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    category: product?.category || body.category || "",
  };

  reviews.push(review);
  saveReviews(reviews);

  return NextResponse.json(review, { status: 201 });
}
