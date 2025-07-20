import { db } from "@/server";
import { NextResponse } from "next/server";

export async function GET() {
  const products = await db.query.products.findMany({
    with: {
      tag: {
        with: {
          tag: true,
        },
      },
    },
  });

  return NextResponse.json(products);
}
