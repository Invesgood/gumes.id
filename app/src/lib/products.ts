import fs from "fs";
import path from "path";

export interface Product {
  id: string;
  name: string;
  material: string;
  price: string;
  priceNum: number;
  image: string;
  category: string;
  isNewArrival: boolean;
  badge?: string;
  featured?: boolean;
}

const DATA_PATH = path.join(process.cwd(), "src/data/products.json");

export function getProducts(): Product[] {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

export function saveProducts(products: Product[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(products, null, 2), "utf-8");
}
