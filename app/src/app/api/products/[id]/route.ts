import { NextRequest, NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/products";
import { revalidatePath } from "next/cache";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const products = getProducts();
  const idx = products.findIndex((p) => p.id === id);

  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  products[idx] = {
    ...products[idx],
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

  saveProducts(products);
  revalidatePath("/");
  revalidatePath("/new-arrival");

  return NextResponse.json(products[idx]);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);

  if (filtered.length === products.length)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  saveProducts(filtered);
  revalidatePath("/");
  revalidatePath("/new-arrival");

  return NextResponse.json({ success: true });
}
