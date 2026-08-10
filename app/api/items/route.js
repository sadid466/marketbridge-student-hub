import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import Product from "@/models/Product";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("sellerId");

    await connectToDatabase();

    // Query items by seller if sellerId is provided, otherwise return all items
    const query = sellerId ? { sellerId } : {};
    const items = await Product.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, items }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
