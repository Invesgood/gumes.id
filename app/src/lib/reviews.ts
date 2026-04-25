import fs from "fs";
import path from "path";

export interface Review {
  id: string;
  productId: string;
  productName: string;
  orderId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  category: string;
}

const DATA_PATH = path.join(process.cwd(), "src/data/reviews.json");

export function getReviews(): Review[] {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

export function saveReviews(reviews: Review[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(reviews, null, 2), "utf-8");
}
