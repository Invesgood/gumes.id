import { NextRequest, NextResponse } from "next/server";
import { getProducts, saveProducts, Product } from "@/lib/products";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  const products = getProducts();
  const newArrival = req.nextUrl.searchParams.get("newArrival");
  const category = req.nextUrl.searchParams.get("category");

  let result = products;
  if (newArrival === "true") result = result.filter((p) => p.isNewArrival);
  if (category && category !== "all") result = result.filter((p) => p.category === category);

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const products = getProducts();

  const newProduct: Product = {
    id: Date.now().toString(),
    name: body.name,
    material: body.material,
    price: body.price,
    priceNum: Number(body.priceNum) || 0,
    image: body.image,
    category: body.category,
    isNewArrival: Boolean(body.isNewArrival),
    badge: body.badge || "",
    featured: Boolean(body.featured),
  };

  products.push(newProduct);
  saveProducts(products);
  revalidatePath("/");
  revalidatePath("/new-arrival");

  return NextResponse.json(newProduct, { status: 201 });
}
